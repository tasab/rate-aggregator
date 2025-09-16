import TelegramBot from 'node-telegram-bot-api';
import { LOG_ERROR, logger } from '../../utils/logger.js';

export const testBotConnection = async (req, res) => {
  try {
    const { botToken, chatId } = req.body;

    if (!botToken || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Bot token та chat ID є обов'язковими",
      });
    }

    const bot = new TelegramBot(botToken);

    try {
      const chatInfo = await bot.getChat(chatId);

      const testMessage = `
      🧪 Тестове повідомлення
      ✅ З'єднання успішно налаштовано!
      🤖 Бот: ${(await bot.getMe()).first_name}
      💬 Чат: ${chatInfo.title || chatInfo.first_name || 'Приватний чат'}
      ⏰ Час тесту: ${new Date().toLocaleString('uk-UA')}
      `;

      const sentMessage = await bot.sendMessage(chatId, testMessage);

      return res.json({
        success: true,
        message: 'Тестове повідомлення надіслано успішно!',
        data: {
          botInfo: {
            id: (await bot.getMe()).id,
            name: (await bot.getMe()).first_name,
            username: (await bot.getMe()).username,
          },
          chatInfo: {
            id: chatInfo.id,
            title: chatInfo.title,
            type: chatInfo.type,
            memberCount:
              chatInfo.all_members_are_administrators !== undefined
                ? 'Група'
                : 'Невідомо',
          },
          messageId: sentMessage.message_id,
        },
      });
    } catch (telegramError) {
      let errorMessage = 'Невідома помилка Telegram API';

      if (telegramError.code === 'ETELEGRAM') {
        switch (telegramError.response?.body?.error_code) {
          case 400:
            errorMessage = 'Невірний chat ID або бот не має доступу до чату';
            break;
          case 401:
            errorMessage = 'Невірний bot token';
            break;
          case 403:
            errorMessage =
              'Бот заблокований користувачем або не доданий до групи';
            break;
          case 404:
            errorMessage = 'Чат не знайдено';
            break;
          default:
            errorMessage =
              telegramError.response?.body?.description || errorMessage;
        }
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
        error: {
          code: telegramError.response?.body?.error_code,
          description: telegramError.response?.body?.description,
        },
      });
    }
  } catch (error) {
    logger(error, 'Failed to load: testBotConnection', LOG_ERROR);
    return res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
      error: error.message,
    });
  }
};
