import { Router } from 'express';
import { getRateSources } from '../controllers/rateSource/getAllRateSources.js';
import { updateRateSource } from '../controllers/rateSource/updateRateSource.js';
import { getRateSourceById } from '../controllers/rateSource/getRateSourceById.js';
const router = Router();

router.get('/rate-source/get-all', getRateSources);
router.get('/rate-source/:id', getRateSourceById);
router.put('/rate-source/update/:id', updateRateSource);

export default router;
