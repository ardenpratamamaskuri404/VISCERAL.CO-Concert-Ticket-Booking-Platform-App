import type { Context } from 'hono';

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const attemptStore = new Map<string, AttemptRecord>();

/**
 * Extracts best-effort client IP from request headers.
 */
export function getClientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return c.req.header('x-real-ip') || 'unknown';
}

function buildKeys(ip: string, email: string): string[] {
  const normalized = email.trim().toLowerCase();
  return [`email:${normalized}`, `ip_email:${ip}:${normalized}`];
}

/**
 * Returns remaining lockout seconds if blocked, or 0 if allowed.
 */
export function getLoginLockoutRemainingSeconds(ip: string, email: string): number {
  const now = Date.now();
  let maxRemainingMs = 0;

  for (const key of buildKeys(ip, email)) {
    const rec = attemptStore.get(key);
    if (!rec?.lockedUntil) continue;
    if (rec.lockedUntil > now) {
      maxRemainingMs = Math.max(maxRemainingMs, rec.lockedUntil - now);
    } else {
      attemptStore.delete(key);
    }
  }

  return Math.ceil(maxRemainingMs / 1000);
}

/**
 * Records a failed authentication attempt; returns newly triggered lockout seconds (0 if not yet locked).
 */
export function recordFailedLoginAttempt(ip: string, email: string): number {
  const now = Date.now();
  let lockedSeconds = 0;

  for (const key of buildKeys(ip, email)) {
    const current = attemptStore.get(key);
    const nextCount = (current && (!current.lockedUntil || current.lockedUntil <= now) ? current.count : 0) + 1;

    if (nextCount >= MAX_FAILED_ATTEMPTS) {
      attemptStore.set(key, { count: nextCount, lockedUntil: now + LOCKOUT_DURATION_MS });
      lockedSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    } else {
      attemptStore.set(key, { count: nextCount, lockedUntil: null });
    }
  }

  return lockedSeconds;
}

/**
 * Clears failed login counters upon successful authentication.
 */
export function clearLoginAttempts(ip: string, email: string): void {
  for (const key of buildKeys(ip, email)) {
    attemptStore.delete(key);
  }
}
