import { Hono } from 'hono';
import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../services/email.service';

const authRoutes = new Hono<{ Variables: { user: any } }>();
const JWT_SECRET = process.env.JWT_SECRET || 'visceral_secret_key';

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
        email,
        password: hashedPassword,
        phoneNumber,
        role: 'CUSTOMER'
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return c.json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Register Error:', error);
    return c.json({ error: 'Terjadi kesalahan pada server' }, 500);
  }
});

// LOGIN
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email dan Password wajib diisi!' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ error: 'Email atau password salah!' }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: 'Email atau password salah!' }, 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return c.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return c.json({ error: 'Terjadi kesalahan pada server' }, 500);
  }
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
