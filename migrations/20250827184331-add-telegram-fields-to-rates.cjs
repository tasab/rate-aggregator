'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rates', 'telegram_bot_token', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Telegram bot token for notifications',
    });

    await queryInterface.addColumn('rates', 'telegram_chat_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Telegram chat/group ID for notifications',
    });

    await queryInterface.addColumn('rates', 'telegram_notifications_enabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Enable/disable telegram notifications for this rate',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('rates', 'telegram_bot_token');
    await queryInterface.removeColumn('rates', 'telegram_chat_id');
    await queryInterface.removeColumn(
      'rates',
      'telegram_notifications_enabled'
    );
  },
};
