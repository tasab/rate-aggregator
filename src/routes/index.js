import { register } from '../controllers/auth/register.js';
import { login } from '../controllers/auth/login.js';
import authMiddleware from '../middleware/authMiddleware.js';
import currencyRouter from './currencyRouter.js';
import rateSourceRouter from './rateSourceRouter.js';
import rateSourceOrderRouter from './rateSourceOrderRouter.js';
import rateRouter from './rateRouter.js';
import telegramRouter from './telegramRouter.js';
import workerRouter from './workerRouter.js';

import { Router } from 'express';
import { verifyToken } from '../controllers/auth/verifyToken.js';
import { getServerTime } from '../controllers/time.js';

const mainRouter = Router();

mainRouter.post('/register', register);
mainRouter.post('/login', login);
mainRouter.get('/verify-token', verifyToken);
mainRouter.get('/time', getServerTime);
mainRouter.use('/currency', authMiddleware, currencyRouter);
mainRouter.use('/rate-source', authMiddleware, rateSourceRouter);
mainRouter.use('/rate-source-order', authMiddleware, rateSourceOrderRouter);
mainRouter.use('/rate', authMiddleware, rateRouter);
mainRouter.use('/worker', authMiddleware, workerRouter);
mainRouter.use('/telegram', authMiddleware, telegramRouter);

export default mainRouter;
