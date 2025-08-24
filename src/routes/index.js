import { register } from '../controllers/auth/register.js';
import { login } from '../controllers/auth/login.js';
import authMiddleware from '../middleware/authMiddleware.js';
import currencyRouter from './currencyRouter.js';
import rateSourceRouter from './rateSourceRouter.js';
import rateSourceOrderRouter from './rateSourceOrderRouter.js';
import rateRouter from './rateRouter.js';
import minFinRouter from './minFinRouter.js';
import { Router } from 'express';

const mainRouter = Router();

mainRouter.post('/register', register);
mainRouter.post('/login', login);
mainRouter.use('/currency', authMiddleware, currencyRouter);
mainRouter.use('/rate-source', authMiddleware, rateSourceRouter);
mainRouter.use('/rate-source-order', authMiddleware, rateSourceOrderRouter);
mainRouter.use('/rate', authMiddleware, rateRouter);
mainRouter.use('/min-fin', authMiddleware, minFinRouter);

export default mainRouter;
