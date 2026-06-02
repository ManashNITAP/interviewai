import { Server } from 'socket.io';
import cookie from 'cookie';
import { verifyAccessToken } from '../utils/tokens.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { registerInterviewHandlers } from './interview.socket.js';
import { registerChatHandlers } from './chat.socket.js';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const raw = socket.handshake.headers.cookie || '';
      const cookies = cookie.parse(raw);
      const token = socket.handshake.auth?.token || cookies.accessToken;
      if (!token) return next(new Error('Unauthorized: token missing'));
      const decoded = verifyAccessToken(token);
      socket.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      next(new Error('Unauthorized: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (user ${socket.user.id})`);
    registerInterviewHandlers(io, socket);
    registerChatHandlers(io, socket);
    socket.on('disconnect', (reason) => logger.info(`Socket disconnected: ${socket.id} (${reason})`));
  });

  return io;
};
