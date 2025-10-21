import { Router } from 'express';
import { getRateCartData } from '../controllers/chart/getRateCartData.js';
const router = Router();

router.get('/chart/rate/:rateId', getRateCartData);

export default router;
