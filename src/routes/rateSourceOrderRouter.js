import { Router } from 'express';
import { createRateSourceOrder } from '../controllers/rateSourceOrder/createRateSourceOrder.js';
import { getRateSourceOrdersByUser } from '../controllers/rateSourceOrder/getRateSourceOrdersByUser.js';
const router = Router();

router.get('/', getRateSourceOrdersByUser);
router.post('/', createRateSourceOrder);

export default router;
