import express from 'express';
import cors from 'cors';
import config from 'config';
import mainRouter from './src/routes/index.js';

const app = express();
const port = config.port || 3000;

app.use(cors());
app.use(express.json());
app.use(mainRouter);
app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
