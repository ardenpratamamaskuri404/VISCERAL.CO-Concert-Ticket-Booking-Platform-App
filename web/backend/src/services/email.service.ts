import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '127.0.0.1';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 1025;
const EMAIL_FROM = process.env.EMAIL_FROM || '"VISCERAL.CO Security" <no-reply@visceral.co>';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  ignoreTLS: true,
});

/**
 * Mengirimkan email OTP Reset Password berdesain resmi VISCERAL.CO ke Mailpit (SMTP Laragon)
 */
export async function sendOtpEmail(to: string, otp: string, recipientName: string = 'Pengguna'): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kode Verifikasi VISCERAL.CO</title>
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
            Kami menerima permintaan untuk mengatur ulang kata sandi akun VISCERAL.CO Anda. Gunakan kode verifikasi One-Time Password (OTP) berikut untuk melanjutkan:
          </div>

          <div class="otp-box">
            <div class="otp-label">Kode Verifikasi Anda</div>
            <div class="otp-code">${otp}</div>
          </div>

          <div class="warning-box">
            <p class="warning-text">
              ⏱️ <strong>Masa Berlaku:</strong> Kode ini hanya berlaku selama <strong>5 menit</strong>.<br>
              🔒 <strong>Keamanan:</strong> Demi keamanan akun, jangan pernah membagikan kode OTP ini kepada siapa pun, termasuk staf VISCERAL.CO.
            </p>
          </div>

          <div class="desc" style="font-size: 12px; color: #7D746D; margin-bottom: 0;">
            Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini. Akun Anda tetap aman.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} PT Visceral Kreatif Indonesia. Hak Cipta Dilindungi.<br>
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
      subject: `[VISCERAL.CO] Kode Verifikasi Reset Password: ${otp}`,
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
