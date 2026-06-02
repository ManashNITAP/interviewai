import { Chat } from '../models/Chat.model.js';

export const registerChatHandlers = (io, socket) => {
  socket.on('chat:history', async ({ interviewId }) => {
    const chat = await Chat.findOne({ interviewId, userId: socket.user.id });
    socket.emit('chat:history', { messages: chat?.messages || [] });
  });
};
