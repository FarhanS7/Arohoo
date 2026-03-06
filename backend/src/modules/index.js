import express from 'express';
import adminRoutes from './admin/admin.routes.js';
import authRoutes from './auth/auth.routes.js';
import cartRoutes from './cart/cart.routes.js';
import categoryRoutes from './categories/category.routes.js';
import publicCategoryRoutes from './categories/public.category.routes.js';
import productRoutes from './products/product.routes.js';
import publicProductRoutes from './products/public.product.routes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/categories', categoryRoutes);
rootRouter.use('/public/categories', publicCategoryRoutes);
rootRouter.use('/merchant/products', productRoutes);
rootRouter.use('/public/products', publicProductRoutes);
rootRouter.use('/cart', cartRoutes);

export default rootRouter;
