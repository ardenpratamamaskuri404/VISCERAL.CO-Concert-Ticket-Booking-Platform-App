import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import eventsRoutes from './routes/events.routes';
import ordersRoutes from './routes/orders.routes';
import artistsRoutes from './routes/artists.routes';
import usersRoutes from './routes/users.routes';
import ticketsRoutes from './routes/tickets.routes';
import notificationsRoutes from './routes/notifications.routes';
import chatRoutes from './routes/chat.routes';

const app = new Hono();

// Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean),
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Health Check
app.get('/', (c) => c.json({ message: 'VISCERAL.CO API is running!' }));

// Static Files
app.use('/assets/*', serveStatic({ root: path.resolve(process.cwd(), 'public') }));

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/events', eventsRoutes);
app.route('/api/orders', ordersRoutes);
app.route('/api/artists', artistsRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/tickets', ticketsRoutes);
app.route('/api/notifications', notificationsRoutes);
app.route('/api/chat', chatRoutes);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Set up node HTTP server for Socket.io integration
const server = serve({
  fetch: app.fetch,
  port
}) as HTTPServer;

const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean),
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Custom room joining for events (seat locking) and orders (payment status)
  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Chat logic
  socket.on('send_chat_message', async (data: { senderId: string, message: string, receiverId?: string, senderRole?: string }) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prismaClient = new PrismaClient();
      
      const newChat = await prismaClient.chatMessage.create({
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId || null,
          message: data.message
        },
        include: { sender: { select: { id: true, fullName: true, role: true } } }
      });

      // Broadcast to admins
      io.emit('new_chat_message', newChat);
      
      // Also broadcast a notification to admins
      if (data.senderRole === 'CUSTOMER') {
        io.emit('new_notification', {
          title: 'Pesan Baru',
          message: `Pesan dari ${newChat.sender.fullName}: ${data.message}`,
          type: 'CHAT'
        });
      }
    } catch (e) {
      console.error('Socket chat error:', e);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Export io so other modules (like controllers) can emit events
export { io };

console.log(`Server is running on http://localhost:${port}`);
