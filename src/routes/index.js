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
import DBHealthRouter from './DBHealthRouter.js';
import { bootSourcesFetch } from '../controllers/bootSourcesFetch.js';

const mainRouter = Router();

mainRouter.use('/db', DBHealthRouter);

mainRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

mainRouter.get('/boot', bootSourcesFetch);

mainRouter.post('/register', register);
mainRouter.post('/login', login);
mainRouter.get('/verify-token', verifyToken);
mainRouter.get('/time', getServerTime);
mainRouter.use('/', authMiddleware, currencyRouter);
mainRouter.use('/', authMiddleware, rateSourceRouter);
mainRouter.use('/', authMiddleware, rateSourceOrderRouter);
mainRouter.use('/', authMiddleware, rateRouter);
mainRouter.use('/', authMiddleware, workerRouter);
mainRouter.use('/', authMiddleware, telegramRouter);

export default mainRouter;
