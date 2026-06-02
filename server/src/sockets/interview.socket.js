import { Interview } from '../models/Interview.model.js';
import { Chat } from '../models/Chat.model.js';
import { evaluateAnswer } from '../services/interview.service.js';
import { logger } from '../utils/logger.js';

export const registerInterviewHandlers = (io, socket) => {
  socket.on('interview:join', async ({ interviewId }) => {
    const interview = await Interview.findOne({ _id: interviewId, userId: socket.user.id });
    if (!interview) return socket.emit('interview:error', { message: 'Not found' });
    socket.join(`interview:${interviewId}`);
    socket.emit('interview:state', {
      currentIndex: interview.currentIndex,
      total: interview.questions.length,
      currentQuestion: interview.questions[interview.currentIndex]?.question || null,
    });
  });

  socket.on('interview:answer', async ({ interviewId, answer }) => {
    try {
      const interview = await Interview.findOne({ _id: interviewId, userId: socket.user.id });
      if (!interview) return socket.emit('interview:error', { message: 'Not found' });
      const q = interview.questions[interview.currentIndex];
      if (!q) return socket.emit('interview:error', { message: 'No active question' });

      io.to(`interview:${interviewId}`).emit('interview:typing', { who: 'ai', typing: true });
      const evaluation = await evaluateAnswer({
        role: interview.role,
        difficulty: interview.difficulty,
        question: q.question,
        answer,
      });
      io.to(`interview:${interviewId}`).emit('interview:typing', { who: 'ai', typing: false });

      q.answer = answer;
      q.evaluation = evaluation;
      q.answeredAt = new Date();
      interview.currentIndex += 1;
      await interview.save();

      await Chat.findOneAndUpdate(
        { interviewId },
        {
          $setOnInsert: { userId: socket.user.id, interviewId },
          $push: { messages: { $each: [
            { sender: 'user', content: answer },
            { sender: 'ai', content: evaluation.feedback },
          ] } },
        },
        { upsert: true, new: true },
      );

      socket.emit('interview:feedback', { evaluation });
      const next = interview.questions[interview.currentIndex];
      if (next) socket.emit('interview:question', { question: next.question, index: interview.currentIndex });
      else socket.emit('interview:done');
    } catch (err) {
      logger.error('interview:answer error', err);
      socket.emit('interview:error', { message: err.message });
    }
  });

  socket.on('interview:typing', ({ interviewId, typing }) =>
    socket.to(`interview:${interviewId}`).emit('interview:typing', { who: 'user', typing }));
};
