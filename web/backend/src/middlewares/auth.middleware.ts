import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { getJwtSecret } from '../config/session';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { error: 'Akses ditolak, token autentikasi tidak ditemukan', code: 'TOKEN_MISSING' },
      401
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as {
      id: string;
      role: string;
      iat?: number;
      exp?: number;
    };

    if (!decoded?.id || !decoded?.exp) {
      return c.json(
        { error: 'Token sesi tidak valid. Silakan login kembali.', code: 'SESSION_INVALID' },
        401
      );
    }

    // Pastikan user masih aktif di database dan role sinkron secara real-time
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, fullName: true, role: true, avatarUrl: true },
    });

    if (!dbUser) {
      return c.json(
        { error: 'Akun sudah tidak aktif. Silakan login ulang.', code: 'SESSION_INVALID' },
        401
      );
    }

    c.set('user', {
      ...dbUser,
      iat: decoded.iat,
      exp: decoded.exp,
    });

    await next();
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      return c.json(
        { error: 'Sesi login Anda telah habis. Silakan login ulang.', code: 'SESSION_EXPIRED' },
        401
      );
    }
    return c.json(
      { error: 'Token tidak valid atau kedaluwarsa. Silakan login ulang.', code: 'SESSION_INVALID' },
      401
    );
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ error: 'Akses ditolak. Role Anda tidak memiliki izin.', code: 'FORBIDDEN' }, 403);
    }
    await next();
  };
};
