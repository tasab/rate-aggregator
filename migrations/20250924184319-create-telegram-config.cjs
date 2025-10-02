'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('telegram_configs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'user_rates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bot_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chat_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message_header: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      message_footer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_connected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notifications_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('telegram_configs', ['rate_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('telegram_configs');
  },
};
