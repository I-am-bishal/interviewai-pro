/**
 * Socket.IO — real-time events for live interview sessions
 * Events:
 *   interview:join        client joins a session room
 *   interview:transcript  client sends a speech transcript chunk
 *   interview:aiResponse  server pushes AI response back
 *   interview:end         client ends session
 */

const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    // Join a specific interview room
    socket.on('interview:join', ({ interviewId }) => {
      socket.join(`interview:${interviewId}`);
      socket.emit('interview:joined', { interviewId });
    });

    // Client sends a speech transcript
    socket.on('interview:transcript', ({ interviewId, transcript }) => {
      // Broadcast transcript to other clients in room (e.g., admin observer mode)
      socket.to(`interview:${interviewId}`).emit('interview:transcript', { transcript });
    });

    // Typing indicator when AI is generating response
    socket.on('interview:typing', ({ interviewId }) => {
      io.to(`interview:${interviewId}`).emit('interview:aiTyping');
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
