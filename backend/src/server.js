import 'dotenv/config';
import app from './app.js';
import logger from './common/utils/logger.js';
// In a real scenario, we'll import database connection here
// import { connectDB } from './database/connection.js';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // await connectDB();
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM (e.g. from Heroku or Docker)
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        logger.info('💥 Process terminated!');
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
