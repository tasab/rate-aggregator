import TelegramBot from 'node-telegram-bot-api';

export const getBotInfo = async (req, res) => {
  try {
    const { botToken } = req.body;

    if (!botToken) {
      return res.status(400).json({
        success: false,
        message: "Bot token є обов'язковим",
      });
    }

    const bot = new TelegramBot(botToken);

    try {
      const botInfo = await bot.getMe();

      return res.json({
        success: true,
        data: {
          id: botInfo.id,
          isBot: botInfo.is_bot,
          firstName: botInfo.first_name,
          username: botInfo.username,
          canJoinGroups: botInfo.can_join_groups,
          canReadAllGroupMessages: botInfo.can_read_all_group_messages,
          supportsInlineQueries: botInfo.supports_inline_queries,
        },
      });
    } catch (telegramError) {
      console.log(telegramError, 'telegramError111');
      return res.status(400).json({
        success: false,
        message: 'Невірний bot token',
        error: telegramError.message,
      });
    }
  } catch (error) {
    console.error('Bot info error:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};
