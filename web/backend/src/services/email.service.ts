import nodemailer from 'nodemailer';
import { prisma } from '../config/db';

const SMTP_HOST = process.env.SMTP_HOST || '127.0.0.1';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 1025;
const EMAIL_FROM = process.env.EMAIL_FROM || '"VISCERAL.CO Security" <no-reply@visceral.co>';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  ignoreTLS: true,
});

export type OtpEmailPurpose = 'LOGIN' | 'RESET_PASSWORD';

/**
 * Mengirimkan email OTP (Login 2FA / Reset Password) berdesain resmi VISCERAL.CO ke Mailpit (SMTP Laragon)
 */
export async function sendOtpEmail(
  to: string,
  otp: string,
  recipientName: string = 'Pengguna',
  purpose: OtpEmailPurpose = 'RESET_PASSWORD'
): Promise<boolean> {
  const isLogin = purpose === 'LOGIN';
  const emailTitle = isLogin ? 'Kode OTP Login VISCERAL.CO' : 'Kode Verifikasi VISCERAL.CO';
  const emailSubject = isLogin
    ? `[VISCERAL.CO] Kode OTP Login Akun: ${otp}`
    : `[VISCERAL.CO] Kode Verifikasi Reset Password: ${otp}`;
  const introText = isLogin
    ? 'Kami mendeteksi percobaan masuk ke akun VISCERAL.CO Anda. Masukkan kode One-Time Password (OTP) 6 digit berikut untuk menyelesaikan proses login:'
    : 'Kami menerima permintaan untuk mengatur ulang kata sandi akun VISCERAL.CO Anda. Gunakan kode verifikasi One-Time Password (OTP) berikut untuk melanjutkan:';
  const otpLabel = isLogin ? 'Kode OTP Login Anda' : 'Kode Verifikasi Anda';
  const footnoteText = isLogin
    ? 'Jika Anda tidak merasa melakukan login ini, segera ubah kata sandi akun Anda karena seseorang mungkin mengetahui password Anda.'
    : 'Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini. Akun Anda tetap aman.';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailTitle}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0B0908;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #F5F5F0;
        }
        .container {
          max-width: 560px;
          margin: 40px auto;
          background-color: #14110F;
          border: 1px solid #2B2623;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .header {
          padding: 32px 24px 20px;
          text-align: center;
          background: linear-gradient(180deg, rgba(200, 155, 60, 0.08) 0%, rgba(20, 17, 15, 0) 100%);
          border-bottom: 1px solid #2B2623;
        }
        .brand {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #C89B3C;
          text-transform: uppercase;
          margin: 0;
        }
        .tagline {
          font-size: 11px;
          letter-spacing: 2px;
          color: #8C827A;
          text-transform: uppercase;
          margin-top: 6px;
        }
        .content {
          padding: 36px 32px;
        }
        .greeting {
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 12px;
        }
        .desc {
          font-size: 14px;
          line-height: 1.6;
          color: #B5ACA4;
          margin-bottom: 28px;
        }
        .otp-box {
          background-color: #1D1815;
          border: 2px dashed #C89B3C;
          border-radius: 16px;
          padding: 24px 16px;
          text-align: center;
          margin: 24px 0 28px;
        }
        .otp-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8C827A;
          margin-bottom: 8px;
        }
        .otp-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: 10px;
          color: #E2B755;
          margin: 0;
          padding-left: 10px;
        }
        .warning-box {
          background-color: rgba(200, 155, 60, 0.05);
          border-left: 3px solid #C89B3C;
          padding: 14px 16px;
          border-radius: 6px;
          margin-bottom: 24px;
        }
        .warning-text {
          font-size: 12px;
          line-height: 1.5;
          color: #C2B7AD;
          margin: 0;
        }
        .footer {
          padding: 20px 32px 30px;
          text-align: center;
          border-top: 1px solid #201C19;
          font-size: 11px;
          color: #6E655E;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="brand">VISCERAL.CO</h1>
          <div class="tagline">Official Ticketing Platform</div>
        </div>
        <div class="content">
          <div class="greeting">Halo, ${recipientName}</div>
          <div class="desc">
            ${introText}
          </div>

          <div class="otp-box">
            <div class="otp-label">${otpLabel}</div>
            <div class="otp-code">${otp}</div>
          </div>

          <div class="warning-box">
            <p class="warning-text">
              ⏱️ <strong>Masa Berlaku:</strong> Kode ini hanya berlaku selama <strong>5 menit</strong>.<br>
              🔒 <strong>Keamanan:</strong> Demi keamanan akun, jangan pernah membagikan kode OTP ini kepada siapa pun, termasuk staf VISCERAL.CO.
            </p>
          </div>

          <div class="desc" style="font-size: 12px; color: #7D746D; margin-bottom: 0;">
            ${footnoteText}
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Visceral Digital Kreatif. Hak Cipta Dilindungi.<br>
          Email keamanan sistem otomatis. Mohon tidak membalas email ini.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: emailSubject,
      text: `Kode verifikasi OTP akun VISCERAL.CO Anda adalah: ${otp}. Berlaku selama 5 menit. Jangan bagikan kepada siapa pun.`,
      html: htmlContent,
    });
    console.log(`[Mailpit] OTP email sent to ${to} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('[Mailpit] Failed to send OTP email:', error);
    return false;
  }
}

/**
 * Mengirimkan email E-Ticket & Invoice Pembelian Lunas ke Mailpit SMTP (berlaku untuk Web & Mobile)
 */
export async function sendOrderSuccessEmail(orderId: string): Promise<boolean> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        tickets: {
          include: {
            seat: true,
            category: { include: { event: true } },
          },
        },
      },
    });

    if (!order || !order.customer?.email) return false;

    const firstEvent = order.tickets[0]?.category?.event;
    const eventTitle = firstEvent?.title || 'Konser VISCERAL.CO';
    const venueName = firstEvent?.venueName || '-';
    const eventDateText = firstEvent?.eventDate
      ? new Date(firstEvent.eventDate).toLocaleString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB'
      : '-';

    const paymentLabel = String(order.paymentChannel || order.paymentMethod || 'DOKU').replace(/_/g, ' ');
    const totalFormatted = `Rp ${Number(order.totalAmount).toLocaleString('id-ID')}`;

    const ticketRowsHtml = order.tickets
      .map(
        (t) => `
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2B2623; color: #F5F5F0; font-size: 13px;">
              <strong>${t.category?.name || 'Tiket'}</strong><br>
              <span style="color: #9E9893; font-size: 11px;">Kursi: ${t.seat?.seatNumber || 'Standing / Festival'}</span>
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2B2623; color: #E2B755; font-family: monospace; font-size: 12px; text-align: right;">
              ${t.ticketCode}
            </td>
          </tr>
        `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Pembayaran & E-Ticket VISCERAL.CO</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0B0908; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F5F5F0;">
        <div style="max-width: 600px; margin: 36px auto; background-color: #14110F; border: 1px solid #2B2623; border-radius: 20px; overflow: hidden;">
          <div style="padding: 28px 24px 20px; text-align: center; background: linear-gradient(180deg, rgba(200, 155, 60, 0.1) 0%, rgba(20, 17, 15, 0) 100%); border-bottom: 1px solid #2B2623;">
            <h1 style="font-size: 22px; font-weight: 900; letter-spacing: 4px; color: #C89B3C; margin: 0;">VISCERAL.CO</h1>
            <div style="font-size: 11px; letter-spacing: 2px; color: #8C827A; text-transform: uppercase; margin-top: 6px;">Konfirmasi Pembayaran & E-Ticket Resmi</div>
          </div>

          <div style="padding: 30px 28px;">
            <p style="font-size: 16px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px;">Halo, ${order.customer.fullName}</p>
            <p style="font-size: 14px; line-height: 1.6; color: #B5ACA4; margin: 0 0 22px;">
              Pembayaran Anda telah berhasil dikonfirmasi. Berikut rincian pesanan dan kode E-Ticket resmi Anda:
            </p>

            <div style="background-color: #1D1815; border: 1px solid #2B2623; border-radius: 14px; padding: 16px 18px; margin-bottom: 20px;">
              <div style="font-size: 11px; color: #8C827A; text-transform: uppercase; letter-spacing: 1px;">Nomor Order</div>
              <div style="font-size: 18px; font-weight: 800; color: #E2B755; font-family: monospace; margin: 4px 0 12px;">${order.orderNumber}</div>

              <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">${eventTitle}</div>
              <div style="font-size: 12px; color: #B5ACA4; margin-bottom: 2px;">Lokasi: ${venueName}</div>
              <div style="font-size: 12px; color: #B5ACA4; margin-bottom: 10px;">Jadwal: ${eventDateText}</div>

              <div style="display: flex; justify-content: space-between; font-size: 12px; color: #B5ACA4; border-top: 1px dashed #2B2623; padding-top: 10px;">
                <span>Metode: <strong style="color: #FFFFFF;">${paymentLabel}</strong></span>
                <span style="margin-left: 16px;">Total: <strong style="color: #2ECC71;">${totalFormatted} (LUNAS)</strong></span>
              </div>
            </div>

            <div style="font-size: 12px; font-weight: 700; color: #C89B3C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Daftar E-Ticket (${order.tickets.length} Tiket)</div>
            <table style="width: 100%; border-collapse: collapse; background-color: #1A1613; border: 1px solid #2B2623; border-radius: 12px; overflow: hidden;">
              <thead>
                <tr style="background-color: #201C19;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; color: #8C827A; text-transform: uppercase;">Kategori & Kursi</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; color: #8C827A; text-transform: uppercase;">Kode Tiket QR</th>
                </tr>
              </thead>
              <tbody>
                ${ticketRowsHtml}
              </tbody>
            </table>

            <p style="font-size: 12px; color: #8C827A; line-height: 1.5; margin-top: 20px; margin-bottom: 0;">
              Tunjukkan QR Code pada halaman <strong>Tiket Saya</strong> di Web atau Aplikasi Mobile VISCERAL.CO saat memasuki pintu masuk venue.
            </p>
          </div>

          <div style="padding: 18px 28px 26px; text-align: center; border-top: 1px solid #201C19; font-size: 11px; color: #6E655E; line-height: 1.5;">
            &copy; ${new Date().getFullYear()} Visceral Digital Kreatif. Hak Cipta Dilindungi.<br>
            Email transaksi otomatis sistem VISCERAL.CO.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: order.customer.email,
      subject: `[VISCERAL.CO] Pembayaran Berhasil & E-Ticket (${order.orderNumber})`,
      text: `Halo ${order.customer.fullName}, pembayaran pesanan ${order.orderNumber} untuk ${eventTitle} sebesar ${totalFormatted} via ${paymentLabel} telah berhasil. Cek QR Code di menu Tiket Saya.`,
      html: htmlContent,
    });

    console.log(`[Mailpit] Order confirmation sent to ${order.customer.email} for ${order.orderNumber} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('[Mailpit] Failed to send order confirmation email:', error);
    return false;
  }
}
