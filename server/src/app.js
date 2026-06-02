import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import router from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

export const app = express();
app.set('trust proxy', 1); // Required behind Render's TLS proxy

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
if (env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/v1', apiLimiter, router);
app.use(notFound);
app.use(errorHandler);
