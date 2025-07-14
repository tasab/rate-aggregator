import { Router } from 'express';
import { getAllRateSources } from '../controllers/rateSource/getAllRateSources.js';
import { updateRateSource } from '../controllers/rateSource/updateRateSource.js';
import { getRateSourceById } from '../controllers/rateSource/getRateSourceById.js';
const router = Router();

router.get('/get-all', getAllRateSources);
router.get('/:id', getRateSourceById);
router.put('/update', updateRateSource);

export default router;
