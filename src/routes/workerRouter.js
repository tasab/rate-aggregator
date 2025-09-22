import { Router } from 'express';
import { getWorkerRate } from '../controllers/workers/getWorkerRate.js';
const router = Router();

router.get('/worker/rate', getWorkerRate);

export default router;
