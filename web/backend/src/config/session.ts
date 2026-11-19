import jwt from 'jsonwebtoken';

export const OTP_EXPIRY_MINUTES = 5;

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'visceral_secret_key';
}

/**
 * Menghitung durasi sesi login dalam detik berdasarkan role atau konfigurasi .env.
 * Default:
 * - ADMIN / SUPERADMIN: 2 jam
 * - CUSTOMER: 4 jam
 * Dapat di-override lewat .env:
 * - SESSION_DURATION_MINUTES (untuk testing cepat)
 * - SESSION_DURATION_HOURS (override global semua role)
 * - SESSION_HOURS_ADMIN / SESSION_HOURS_CUSTOMER
 */
export function getSessionDurationSeconds(role: string): number {
  const envMinutes = Number(process.env.SESSION_DURATION_MINUTES);
  if (!Number.isNaN(envMinutes) && envMinutes > 0) {
    return Math.round(envMinutes * 60);
  }

  const globalHours = Number(process.env.SESSION_DURATION_HOURS);
  if (!Number.isNaN(globalHours) && globalHours > 0) {
    return Math.round(globalHours * 3600);
  }

  const isStaff = role === 'ADMIN' || role === 'SUPERADMIN';
  const defaultHours = isStaff
    ? Number(process.env.SESSION_HOURS_ADMIN) || 2
    : Number(process.env.SESSION_HOURS_CUSTOMER) || 4;

  return Math.round(defaultHours * 3600);
}

export function signSessionToken(user: { id: string; role: string }) {
  const expiresInSeconds = getSessionDurationSeconds(user.role);
  const token = jwt.sign(
    { id: user.id, role: user.role },
    getJwtSecret(),
    { expiresIn: expiresInSeconds }
  );

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
  const expiresInHours = Number((expiresInSeconds / 3600).toFixed(2));

  return {
    token,
    expiresAt,
    expiresInSeconds,
    expiresInHours,
  };
}
