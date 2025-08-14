import express from 'express';
import cors from 'cors';
import { login } from './src/controllers/auth/login.js';
import { register } from './src/controllers/auth/register.js';
import currencyRouter from './src/routes/currencyRouter.js';
import rateSourceRouter from './src/routes/rateSourceRouter.js';
import rateRouter from './src/routes/rateRouter.js';
import authMiddleware from './src/middleware/authMiddleware.js';
import minFinRouter from './src/routes/minFinRouter.js';
import rateSourceOrderRouter from './src/routes/rateSourceOrderRouter.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/register', register);
app.post('/login', login);
app.use('/currency', authMiddleware, currencyRouter);
app.use('/rate-source', authMiddleware, rateSourceRouter);
app.use('/rate-source-order', authMiddleware, rateSourceOrderRouter);
app.use('/rate', authMiddleware, rateRouter);
app.use('/min-fin', authMiddleware, minFinRouter);

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
