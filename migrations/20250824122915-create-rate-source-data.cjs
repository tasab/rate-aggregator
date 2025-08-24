'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rate_source_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      currency_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      bid_rate: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: false,
      },
      sell_rate: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: false,
      },
      fetched_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      raw_data: {
        type: Sequelize.TEXT,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rate_source_data');
  },
};
