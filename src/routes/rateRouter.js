import { Router } from 'express';
import { createRate } from '../controllers/rate/createRate.js';
import { getAllRates } from '../controllers/rate/getAllRates.js';
import { deleteRate } from '../controllers/rate/deleteRate.js';
import { getCalculatedRate } from '../controllers/rate/getCalculatedRate.js';
import { updateRate } from '../controllers/rate/updateRate.js';
const router = Router();

router.post('/rate/', createRate);
router.put('/rate/update', updateRate);
router.get('/rate/', getAllRates);
router.get('/rate/calculated/:rateId', getCalculatedRate);
router.delete('/rate/:id', deleteRate);

export default router;
