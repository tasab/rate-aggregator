'use strict';

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
        allowNull: true,
      },
      sell_rate: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: true,
      },
      fetched_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      raw_data: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('rate_source_data');
  },
};
