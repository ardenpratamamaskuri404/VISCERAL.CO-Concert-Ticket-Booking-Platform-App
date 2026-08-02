import { Hono } from 'hono';
import { prisma } from '../config/db';
import { authMiddleware } from '../middlewares/auth.middleware';
import { io } from '../index'; // Assuming io is exported from index.ts

const notificationsRoutes = new Hono();

// Get unread notifications count
notificationsRoutes.get('/unread-count', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const count = await prisma.notification.count({
      where: { userId: user.id, isRead: false }
    });

    return c.json({ success: true, count });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Get all notifications for user
notificationsRoutes.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return c.json({ success: true, notifications });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mark all notifications as read
notificationsRoutes.put('/read-all', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true }
    });
    return c.json({ success: true, message: 'All marked as read' });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mark notification as read
notificationsRoutes.put('/:id/read', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user');
    
    await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { isRead: true }
    });

    return c.json({ success: true, message: 'Marked as read' });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export const createNotification = async (title: string, message: string, type: string, roles: string[] = ['ADMIN', 'SUPERADMIN']) => {
  try {
    const targetUsers = await prisma.user.findMany({
      where: { role: { in: roles as any } }
    });

    const notifications = targetUsers.map((user: any) => ({
      userId: user.id,
      title,
      message,
      type
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
      // io is expected to be available for realtime emitting
      if (io) {
        io.emit('new_notification', { title, message, type });
      }
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export default notificationsRoutes;
