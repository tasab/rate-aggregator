import { Router } from 'express';
import { getSharedRate } from '../controllers/share/getSharedRate.js';
const router = Router();

router.get('/share/:rateId', getSharedRate);

export default router;
