import { Router } from 'express';
import { getAllCurrencies } from '../controllers/currency/getAllCurrencies.js';
import { addCurrencies } from '../controllers/currency/addCurrencies.js';
import { updateCurrency } from '../controllers/currency/updateCurrency.js';
const router = Router();

router.get('/currency/get-all-currencies', getAllCurrencies);
router.post('/currency/add-currency', addCurrencies);
router.put('/update-currency', updateCurrency);

export default router;
