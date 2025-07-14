import { Router } from 'express';
import { getAllCurrencies } from '../controllers/currency/getAllCurrencies.js';
import { addCurrencies } from '../controllers/currency/addCurrencies.js';
import { updateCurrency } from '../controllers/currency/updateCurrency.js';
const router = Router();

router.get('/get-all', getAllCurrencies);
router.post('/add', addCurrencies);
router.put('/update', updateCurrency);

export default router;
