import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppError } from './common/errors/AppError.js';
import { globalErrorHandler } from './common/middleware/error.middleware.js';
import apiRouter from './modules/index.js';

const app = express();

// 1. GLOBAL MIDDLEWARES
app.use(helmet()); // Security headers
app.use(cors()); // CORS support

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Request logging
}

app.use(express.json({ limit: '10kb' })); // Body parser

// 2. ROUTES
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

app.use('/api/v1', apiRouter);

// 3. UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
