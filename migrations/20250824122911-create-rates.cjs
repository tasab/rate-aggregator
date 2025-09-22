'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rate_source_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rate_sources',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      telegram_bot_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telegram_chat_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telegram_message_header: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telegram_message_footer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telegram_notifications_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      telegram_success_connection: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_private_rate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      start_working_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      end_working_time: {
        type: Sequelize.TIME,
        allowNull: true,
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable('rates');
  },
};
