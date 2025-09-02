import { Router } from 'express';
import { getWorkerRate } from '../controllers/workers/getWorkerRate.js';
const router = Router();

router.get('/rate', getWorkerRate);

export default router;
