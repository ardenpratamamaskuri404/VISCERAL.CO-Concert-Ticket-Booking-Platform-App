import { Hono } from 'hono';
import path from 'path';
import { prisma } from '../config/db';
import { io } from '../index';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middlewares/auth.middleware';

const usersRoutes = new Hono<{ Variables: { user: any } }>();

// All user routes require authentication
usersRoutes.use('*', authMiddleware);

// GET ALL USERS (SUPERADMIN ONLY)
usersRoutes.get('/', async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Akses ditolak. Hanya Superadmin yang diizinkan.' }, 403);
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return c.json({ data: users });
  } catch (error) {
    return c.json({ error: 'Gagal memuat pengguna' }, 500);
  }
});

// GET ALL AUDIT LOGS (SUPERADMIN ONLY)
usersRoutes.get('/audit-logs', async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Akses ditolak.' }, 403);
    }
    const logs = await prisma.auditLog.findMany({
      include: {
        user: { select: { fullName: true, role: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // limit to last 100 for performance
    });
    return c.json({ data: logs });
  } catch (error) {
    return c.json({ error: 'Gagal memuat audit logs' }, 500);
  }
});

// CREATE AUDIT LOG
usersRoutes.post('/audit-logs', async (c) => {
  try {
    const user = c.get('user');
    const { action, entityId, metadata } = await c.req.json();
    
    const log = await prisma.auditLog.create({
      data: {
        userId: user.id,
        action,
        entityId: entityId || null,
        metadata: metadata || {}
      },
      include: {
        user: { select: { fullName: true, role: true } }
      }
    });
    io.emit('audit_logs_updated');
    return c.json({ success: true, data: log });
  } catch (error) {
    return c.json({ error: 'Gagal menyimpan log' }, 500);
  }
});

// 1. UPDATE PROFILE (Name, Phone, Avatar)
usersRoutes.put('/profile', async (c) => {
  try {
    const user = c.get('user');
    
    // Check if multipart form data
    const contentType = c.req.header('Content-Type') || '';
    let fullName, phoneNumber, avatarUrl;
    
    if (contentType.includes('multipart/form-data')) {
      const body = await c.req.parseBody();
      fullName = body['fullName'];
      phoneNumber = body['phoneNumber'];
      const avatarFile = body['avatarFile'] as File | undefined;
      
      if (avatarFile) {
        const ext = path.extname(avatarFile.name) || '.jpg';
        const filename = `user-${user.id}-${Date.now()}${ext}`;
        const arrayBuffer = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filepath = path.join(process.cwd(), 'public', 'assets', 'users', filename);
        
        // Ensure directory exists
        const fsPromises = require('fs/promises');
        await fsPromises.mkdir(path.join(process.cwd(), 'public', 'assets', 'users'), { recursive: true });
        
        await fsPromises.writeFile(filepath, buffer);
        avatarUrl = filename;
      }
    } else {
      const body = await c.req.json();
      fullName = body.fullName;
      phoneNumber = body.phoneNumber;
      avatarUrl = body.avatarUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: fullName || undefined,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        avatarUrl: true,
        role: true,
      }
    });

    return c.json({ message: 'Profil berhasil diperbarui', data: updatedUser });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return c.json({ error: 'Gagal memperbarui profil' }, 500);
  }
});

// 2. CHANGE PASSWORD
usersRoutes.put('/password', async (c) => {
  try {
    const user = c.get('user');
    const { oldPassword, newPassword } = await c.req.json();

    if (!oldPassword || !newPassword) {
      return c.json({ error: 'Password lama dan baru wajib diisi' }, 400);
    }

    const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!currentUser) {
      return c.json({ error: 'User tidak ditemukan' }, 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
    if (!isMatch) {
      return c.json({ error: 'Password lama tidak sesuai' }, 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return c.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return c.json({ error: 'Gagal mengubah password' }, 500);
  }
});

// 3. DELETE ACCOUNT
usersRoutes.delete('/account', async (c) => {
  try {
    const user = c.get('user');

    // Prevent SUPERADMIN from deleting themselves easily (optional safeguard)
    if (user.role === 'SUPERADMIN') {
      return c.json({ error: 'Superadmin tidak dapat dihapus melalui endpoint ini' }, 403);
    }

    await prisma.user.delete({
      where: { id: user.id }
    });

    return c.json({ message: 'Akun berhasil dihapus permanen' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    return c.json({ error: 'Gagal menghapus akun' }, 500);
  }
});
// 4. UPDATE USER ROLE (SUPERADMIN ONLY)
usersRoutes.put('/:id/role', async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Akses ditolak. Hanya Superadmin yang diizinkan.' }, 403);
    }

    const targetUserId = c.req.param('id');
    const { role } = await c.req.json();

    if (!['CUSTOMER', 'ADMIN', 'SUPERADMIN'].includes(role)) {
      return c.json({ error: 'Role tidak valid' }, 400);
    }

    if (targetUserId === user.id) {
      return c.json({ error: 'Anda tidak dapat mengubah role Anda sendiri' }, 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return c.json({ error: 'User tidak ditemukan' }, 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_ROLE',
        entityId: targetUserId,
        metadata: { oldRole: targetUser.role, newRole: role, targetName: targetUser.fullName }
      }
    });

    io.emit('users_updated', { action: 'update_role', userId: targetUserId });
    io.emit('audit_logs_updated');

    return c.json({ success: true, message: 'Role berhasil diubah', data: updatedUser });
  } catch (error) {
    console.error('Update Role Error:', error);
    return c.json({ error: 'Gagal mengubah role' }, 500);
  }
});

// 5. CREATE USER / STAFF ADMIN (SUPERADMIN ONLY)
usersRoutes.post('/', async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Akses ditolak. Hanya Superadmin yang diizinkan.' }, 403);
    }

    const { fullName, email, password, phoneNumber, role } = await c.req.json();

    if (!fullName || !email || !password) {
      return c.json({ error: 'Nama lengkap, email, dan password wajib diisi' }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: 'Password minimal 8 karakter' }, 400);
    }

    const validRole = ['CUSTOMER', 'ADMIN', 'SUPERADMIN'].includes(role) ? role : 'ADMIN';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ error: 'Email tersebut sudah terdaftar di sistem' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        role: validRole,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE_USER',
        entityId: createdUser.id,
        metadata: { email: createdUser.email, role: createdUser.role, fullName: createdUser.fullName },
      },
    }).catch(() => {});

    io.emit('users_updated', { action: 'create', userId: createdUser.id });
    io.emit('audit_logs_updated');

    return c.json({ success: true, message: 'Akun pengguna berhasil ditambahkan', data: createdUser }, 201);
  } catch (error) {
    console.error('Create User Error:', error);
    return c.json({ error: 'Gagal menambahkan pengguna baru' }, 500);
  }
});

// 6. DELETE USER (SUPERADMIN ONLY)
usersRoutes.delete('/:id', async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Akses ditolak. Hanya Superadmin yang diizinkan.' }, 403);
    }

    const targetUserId = c.req.param('id');
    if (targetUserId === user.id) {
      return c.json({ error: 'Anda tidak dapat menghapus akun Anda sendiri' }, 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return c.json({ error: 'User tidak ditemukan' }, 404);
    }

    const [orderCount, eventCount] = await Promise.all([
      prisma.order.count({ where: { customerId: targetUserId } }),
      prisma.event.count({ where: { createdById: targetUserId } }),
    ]);

    if (orderCount > 0 || eventCount > 0) {
      return c.json(
        { error: 'Pengguna tidak dapat dihapus karena masih memiliki riwayat transaksi atau event terkait.' },
        400
      );
    }

    await prisma.user.delete({ where: { id: targetUserId } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DELETE_USER',
        entityId: targetUserId,
        metadata: { email: targetUser.email, fullName: targetUser.fullName, role: targetUser.role },
      },
    }).catch(() => {});

    io.emit('users_updated', { action: 'delete', userId: targetUserId });
    io.emit('audit_logs_updated');

    return c.json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return c.json({ error: 'Gagal menghapus pengguna' }, 500);
  }
});

export default usersRoutes;
