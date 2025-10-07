import { Router } from 'express';
import { createRate } from '../controllers/rate/createRate.js';
import { getAllRates } from '../controllers/rate/getAllRates.js';
import { deleteRate } from '../controllers/rate/deleteRate.js';
import { getCalculatedRate } from '../controllers/rate/getCalculatedRate.js';
import { updateRate } from '../controllers/rate/updateRate.js';

const router = Router();

router.post('/user-rate/create', createRate);
router.put('/user-rate/update', updateRate);
router.get('/user-rate/get-all', getAllRates);
router.get('/user-rate/calculated/:rateId', getCalculatedRate);
router.delete('/user-rate/delete/:id', deleteRate);

export default router;
