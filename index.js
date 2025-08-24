import express from 'express';
import cors from 'cors';
import mainRouter from './src/routes/index.js';
import DBHealthRouter from './src/routes/DBHealth.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mainRouter.use('/db', DBHealthRouter);
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.use(mainRouter);

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
