import { Router } from 'express';
import { getBotInfo } from '../controllers/telegram/getBotInfo.js';
import { testBotConnection } from '../controllers/telegram/testBotConnection.js';
const router = Router();

router.post('/get-bot-info', getBotInfo);
router.post('/test-bot-connection', testBotConnection);

export default router;
