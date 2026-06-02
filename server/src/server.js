import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';
import { logger } from './utils/logger.js';

const start = async () => {
  await connectDB();
  const httpServer = http.createServer(app);
  initSocket(httpServer);
  httpServer.listen(env.PORT, () =>
    logger.info(`Server on http://localhost:${env.PORT}`));
};

start().catch((err) => {
  logger.error('Fatal startup error', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => logger.error('Unhandled rejection', err));
process.on('uncaughtException', (err) => { logger.error('Uncaught exception', err); process.exit(1); });
