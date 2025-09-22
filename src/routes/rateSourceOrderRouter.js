import { Router } from 'express';
import { createRateSourceOrder } from '../controllers/rateSourceOrder/createRateSourceOrder.js';
import { getRateSourceOrdersByUser } from '../controllers/rateSourceOrder/getRateSourceOrdersByUser.js';
const router = Router();

router.get('/rate-source-order/', getRateSourceOrdersByUser);
router.post('/rate-source-order/', createRateSourceOrder);

export default router;
