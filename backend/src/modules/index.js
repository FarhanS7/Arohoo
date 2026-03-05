import express from 'express';

// Placeholder routers for modules
const authRouter = express.Router();
const productRouter = express.Router();
const orderRouter = express.Router();
const reviewRouter = express.Router();
const wishlistRouter = express.Router();

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/products', productRouter);
rootRouter.use('/orders', orderRouter);
rootRouter.use('/reviews', reviewRouter);
rootRouter.use('/wishlist', wishlistRouter);

export default rootRouter;
