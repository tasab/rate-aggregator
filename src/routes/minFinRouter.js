import { Router } from 'express';
import { getMinFinRate } from '../controllers/minFin/getMinFinRate.js';
const router = Router();

router.get('/', getMinFinRate);

export default router;
