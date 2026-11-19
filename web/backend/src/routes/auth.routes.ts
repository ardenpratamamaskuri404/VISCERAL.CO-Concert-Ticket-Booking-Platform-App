import { Hono } from 'hono';
import { prisma } from '../config/db';
import { io } from '../index';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../services/email.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { OTP_EXPIRY_MINUTES, signSessionToken } from '../config/session';
import {
  getClientIp,
  getLoginLockoutRemainingSeconds,
  recordFailedLoginAttempt,
  clearLoginAttempts,
} from '../utils/loginRateLimit';

const authRoutes = new Hono<{ Variables: { user: any } }>();

// Helper generate & kirim OTP Login via Mailpit SMTP
async function generateAndSendLoginOtp(user: { id: string; email: string; fullName: string }) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresInSeconds = OTP_EXPIRY_MINUTES * 60;
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCodeHash: otpHash,
      otpExpiresAt: expiresAt,
    },
  });

  const emailSent = await sendOtpEmail(user.email, otp, user.fullName || 'Pengguna', 'LOGIN');
  console.log(`[VISCERAL LOGIN OTP] Kode OTP untuk ${user.email}: ${otp} (Email sent: ${emailSent})`);

  return { expiresInSeconds, emailSent };
}

// REGISTER
authRoutes.post('/register', async (c) => {
  try {
    const { fullName, email, password, phoneNumber } = await c.req.json();

    if (!fullName || !email || !password) {
      return c.json({ error: 'Nama, Email, dan Password wajib diisi!' }, 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return c.json({ error: 'Email sudah terdaftar!' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email: String(email).trim(),
        password: hashedPassword,
        phoneNumber,
        role: 'CUSTOMER'
      }
    });

    const { expiresInSeconds } = await generateAndSendLoginOtp(user);

    io.emit('users_updated', { action: 'register', userId: user.id });

    return c.json({
      requiresOtp: true,
      email: user.email,
      otpExpiresInSeconds: expiresInSeconds,
      message: `Registrasi berhasil. Kode OTP 6 digit telah dikirim ke ${user.email}.`
    });
  } catch (error: any) {
    console.error('Register Error:', error);
    return c.json({ error: 'Terjadi kesalahan pada server' }, 500);
  }
});

// LOGIN STEP 1 — Validasi Email & Password, lalu kirim OTP 6 Digit ke Email
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email dan Password wajib diisi!' }, 400);
    }

    const clientIp = getClientIp(c);
    const normalizedEmail = String(email).trim();
    const lockoutSeconds = getLoginLockoutRemainingSeconds(clientIp, normalizedEmail);
    if (lockoutSeconds > 0) {
      const waitMinutes = Math.ceil(lockoutSeconds / 60);
      return c.json(
        { error: `Terlalu banyak percobaan login gagal. Coba lagi dalam ${waitMinutes} menit.` },
        429
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      const newlyLocked = recordFailedLoginAttempt(clientIp, normalizedEmail);
      if (newlyLocked > 0) {
        return c.json(
          { error: 'Terlalu banyak percobaan login gagal. Akses dikunci sementara selama 15 menit.' },
          429
        );
      }
      return c.json({ error: 'Email atau password salah!' }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const newlyLocked = recordFailedLoginAttempt(clientIp, normalizedEmail);
      if (newlyLocked > 0) {
        if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN_LOCKED_OUT',
              entityId: user.id,
              metadata: { email: user.email, role: user.role, ip: clientIp, reason: '5x_wrong_password' },
            },
          }).catch(() => {});
          io.emit('audit_logs_updated');
        }
        return c.json(
          { error: 'Terlalu banyak percobaan login gagal. Akun dikunci sementara selama 15 menit.' },
          429
        );
      }
      return c.json({ error: 'Email atau password salah!' }, 401);
    }

    const { expiresInSeconds } = await generateAndSendLoginOtp(user);

    return c.json({
      requiresOtp: true,
      email: user.email,
      otpExpiresInSeconds: expiresInSeconds,
      message: `Kode OTP 6 digit telah dikirim ke ${user.email}. Berlaku selama ${OTP_EXPIRY_MINUTES} menit.`
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return c.json({ error: 'Terjadi kesalahan pada server' }, 500);
  }
});

// LOGIN STEP 2 — Verifikasi OTP 6 Digit & Terbitkan Token Sesi Terbatas Waktu
authRoutes.post('/verify-login-otp', async (c) => {
  try {
    const { email, otp } = await c.req.json();

    if (!email || !otp) {
      return c.json({ error: 'Email dan kode OTP wajib diisi!' }, 400);
    }

    const clientIp = getClientIp(c);
    const normalizedEmail = String(email).trim();
    const lockoutSeconds = getLoginLockoutRemainingSeconds(clientIp, normalizedEmail);
    if (lockoutSeconds > 0) {
      const waitMinutes = Math.ceil(lockoutSeconds / 60);
      return c.json(
        { error: `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${waitMinutes} menit.` },
        429
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.otpCodeHash || !user.otpExpiresAt) {
      return c.json({ error: 'Sesi verifikasi OTP tidak ditemukan. Silakan login ulang.' }, 400);
    }

    if (new Date() > user.otpExpiresAt) {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpCodeHash: null, otpExpiresAt: null },
      });
      return c.json({ error: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang OTP.' }, 400);
    }

    const isOtpValid = await bcrypt.compare(String(otp).trim(), user.otpCodeHash);
    if (!isOtpValid) {
      const newlyLocked = recordFailedLoginAttempt(clientIp, normalizedEmail);
      if (newlyLocked > 0) {
        return c.json(
          { error: 'Terlalu banyak percobaan OTP gagal. Akses dikunci sementara selama 15 menit.' },
          429
        );
      }
      return c.json({ error: 'Kode OTP tidak sesuai. Periksa kembali inbox email Anda.' }, 401);
    }

    // Reset rate limit & hapus OTP setelah berhasil dipakai (one-time use)
    clearLoginAttempts(clientIp, normalizedEmail);
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCodeHash: null, otpExpiresAt: null },
    });

    const session = signSessionToken({ id: user.id, role: user.role });

    if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_OTP_VERIFIED',
          entityId: user.id,
          metadata: {
            email: user.email,
            role: user.role,
            expiresAt: session.expiresAt,
            expiresInHours: session.expiresInHours,
          },
        },
      }).catch(() => {});
      io.emit('audit_logs_updated');
    }

    return c.json({
      message: `Login berhasil. Sesi aktif selama ${session.expiresInHours} jam.`,
      token: session.token,
      expiresAt: session.expiresAt,
      expiresInSeconds: session.expiresInSeconds,
      expiresInHours: session.expiresInHours,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error('Verify Login OTP Error:', error);
    return c.json({ error: 'Terjadi kesalahan saat memverifikasi OTP' }, 500);
  }
});

// RESEND LOGIN OTP (memerlukan email & password valid agar tidak disalahgunakan untuk spam)
authRoutes.post('/resend-login-otp', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email dan Password wajib disertakan untuk kirim ulang OTP.' }, 400);
    }

    const clientIp = getClientIp(c);
    const normalizedEmail = String(email).trim();
    const lockoutSeconds = getLoginLockoutRemainingSeconds(clientIp, normalizedEmail);
    if (lockoutSeconds > 0) {
      const waitMinutes = Math.ceil(lockoutSeconds / 60);
      return c.json(
        { error: `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${waitMinutes} menit.` },
        429
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      recordFailedLoginAttempt(clientIp, normalizedEmail);
      return c.json({ error: 'Akun tidak ditemukan.' }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      recordFailedLoginAttempt(clientIp, normalizedEmail);
      return c.json({ error: 'Kredensial tidak valid.' }, 401);
    }

    const { expiresInSeconds } = await generateAndSendLoginOtp(user);

    return c.json({
      success: true,
      email: user.email,
      otpExpiresInSeconds: expiresInSeconds,
      message: `Kode OTP baru telah dikirim ulang ke ${user.email}.`,
    });
  } catch (error: any) {
    console.error('Resend Login OTP Error:', error);
    return c.json({ error: 'Gagal mengirim ulang kode OTP' }, 500);
  }
});

// VERIFIKASI SESI AKTIF (Protected oleh authMiddleware)
authRoutes.get('/session', authMiddleware, async (c) => {
  const user = c.get('user');
  const expMs = user.exp ? user.exp * 1000 : Date.now();
  const remainingSeconds = Math.max(0, Math.floor((expMs - Date.now()) / 1000));

  return c.json({
    valid: true,
    expiresAt: new Date(expMs).toISOString(),
    remainingSeconds,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
});

// FORGOT PASSWORD - REQUEST OTP
authRoutes.post('/forgot-password', async (c) => {
  try {
    const { email, phoneNumber } = await c.req.json();

    if (!email && !phoneNumber) {
      return c.json({ error: 'Masukkan alamat email atau nomor handphone Anda' }, 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || '' },
          { phoneNumber: phoneNumber || '' }
        ]
      }
    });

    if (!user) {
      return c.json({ error: 'Pengguna dengan data tersebut tidak ditemukan' }, 404);
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCodeHash: otpHash,
        otpExpiresAt: expiresAt
      }
    });

    // Kirim email OTP resmi via Mailpit (SMTP Laragon)
    const emailSent = await sendOtpEmail(user.email, otp, user.fullName || 'Pengguna');

    console.log(`[VISCERAL OTP] Kode verifikasi untuk ${user.email}: ${otp} (Email sent: ${emailSent})`);

    return c.json({ 
      success: true,
      message: 'Kode verifikasi OTP telah dikirimkan ke email Anda.',
      email: user.email
    });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return c.json({ error: 'Terjadi kesalahan pada server saat memproses permintaan OTP' }, 500);
  }
});

// RESET PASSWORD
authRoutes.post('/reset-password', async (c) => {
  try {
    const { email, otp, newPassword } = await c.req.json();

    if (!email || !otp || !newPassword) {
      return c.json({ error: 'Semua field (email, otp, new password) wajib diisi' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.otpCodeHash || !user.otpExpiresAt) {
      return c.json({ error: 'Permintaan reset password tidak valid atau kedaluwarsa' }, 400);
    }

    if (new Date() > user.otpExpiresAt) {
      return c.json({ error: 'Kode OTP sudah kedaluwarsa' }, 400);
    }

    const isOtpValid = await bcrypt.compare(otp, user.otpCodeHash);
    if (!isOtpValid) {
      return c.json({ error: 'Kode OTP salah' }, 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCodeHash: null,
        otpExpiresAt: null
      }
    });

    return c.json({ message: 'Password berhasil diubah. Silakan login.' });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return c.json({ error: 'Terjadi kesalahan pada server' }, 500);
  }
});

export default authRoutes;
