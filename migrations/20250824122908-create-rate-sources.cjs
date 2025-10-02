'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rate_sources', {
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
      type: {
        type: Sequelize.ENUM('PRIVATE', 'BANK', 'CANTOR'),
        allowNull: false,
        defaultValue: 'CANTOR',
      },
      controller_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rate_source_order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
        references: {
          model: 'rate_source_orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      currency_count: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      new_updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      prev_updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('rate_sources');
  },
};
