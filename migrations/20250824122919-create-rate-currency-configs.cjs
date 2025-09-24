'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rate_currency_configs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      currency_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bid_margin: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: -0.1,
      },
      bid_should_round: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bid_rounding_depth: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      bid_rounding_type: {
        type: Sequelize.ENUM('ROUND_UP', 'ROUND_DOWN', 'ROUND_DEFAULT'),
        allowNull: false,
        defaultValue: 'ROUND_DEFAULT',
      },
      sell_margin: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0.1,
      },
      sell_should_round: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sell_rounding_depth: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      sell_rounding_type: {
        type: Sequelize.ENUM('ROUND_UP', 'ROUND_DOWN', 'ROUND_DEFAULT'),
        allowNull: false,
        defaultValue: 'ROUND_DEFAULT',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('rate_currency_configs');
  },
};
