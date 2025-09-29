'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calculated_rates', {
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
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      bid: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: true,
      },
      sell: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: true,
      },
      source_rate_data_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rate_source_data',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      calculated_at: {
        type: Sequelize.DATE,
        allowNull: false,
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

    // Add performance indexes
    await queryInterface.addIndex('calculated_rates', {
      fields: ['rate_id'],
      name: 'calculated_rates_rate_id_idx',
    });

    await queryInterface.addIndex('calculated_rates', {
      fields: ['source_rate_data_id'],
      name: 'calculated_rates_source_rate_data_id_idx',
    });

    await queryInterface.addIndex('calculated_rates', {
      fields: ['calculated_at'],
      name: 'calculated_rates_calculated_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('calculated_rates');
  },
};
