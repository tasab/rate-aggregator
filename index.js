import express from 'express';
import cors from 'cors';
import mainRouter from './src/routes/index.js';
import { logger } from './src/utils/logger.js';
import { startFetchRateSource } from './src/cron/rateSourceCron.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

startFetchRateSource();

app.use(mainRouter);

app.listen(port, () =>
  logger(null, `Server is running at http://localhost:${port}`)
);
