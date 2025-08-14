import { Router } from 'express';
import { addCurrencyToRate } from '../controllers/rate/addCurrencyToRate.js';
import { createRate } from '../controllers/rate/createRate.js';
import { getAllRates } from '../controllers/rate/getAllRates.js';
import { deleteRate } from '../controllers/rate/deleteRate.js';
import { getCalculatedRate } from '../controllers/rate/getCalculatedRate.js';
import { updateRate } from '../controllers/rate/updateRate.js';
const router = Router();

router.post('/', createRate);
router.put('/update', updateRate);
router.put('/add-currency', addCurrencyToRate);
router.get('/', getAllRates);
router.get('/calculated/:rateId', getCalculatedRate);
router.delete('/:id', deleteRate);

export default router;
