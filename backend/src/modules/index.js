import express from 'express';
import authRoutes from './auth/auth.routes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);

export default rootRouter;
