import express from 'express';
import adminRoutes from './admin/admin.routes.js';
import authRoutes from './auth/auth.routes.js';
import categoryRoutes from './categories/category.routes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/categories', categoryRoutes);

export default rootRouter;
