import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppError } from './common/errors/AppError.js';
import { globalErrorHandler } from './common/middleware/error.middleware.js';
import logger from './common/utils/logger.js';
import apiRouter from './modules/index.js';

const app = express();

// Set trust proxy to 1 to correctly handle client IP through load balancers
app.set('trust proxy', 1);

// 1. GLOBAL MIDDLEWARES
app.use(helmet()); // Security headers
app.use(cors()); // CORS support

// HTTP request logging via Morgan - optimized format for performance
const morganFormat = process.env.NODE_ENV === 'production' ? 'common' : 'dev';
app.use(morgan(morganFormat, { 
  stream: { write: (message) => logger.info(message.trim()) } 
}));

app.use(express.json({ limit: '10kb' })); // Body parser
app.use(express.static('public')); // Serve static files

// 2. ROUTES
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' ,
 uptime: process.uptime(),
});
});

app.use('/api/v1', apiRouter);

// 3. UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
