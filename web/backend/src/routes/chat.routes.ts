import { Hono } from 'hono';
import { prisma } from '../config/db';
import { authMiddleware } from '../middlewares/auth.middleware';

const chatRoutes = new Hono<{ Variables: { user: any } }>();

// Get chat history
chatRoutes.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const role = user.role;

    let chats;
    if (role === 'SUPERADMIN' || role === 'ADMIN') {
      chats = await prisma.chatMessage.findMany({
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, fullName: true, role: true } } }
      });
    } else {
      chats = await prisma.chatMessage.findMany({
        where: {
          OR: [
            { senderId: user.id },
            { receiverId: user.id }
          ]
        },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, fullName: true, role: true } } }
      });
    }
    return c.json({ success: true, chats });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default chatRoutes;
