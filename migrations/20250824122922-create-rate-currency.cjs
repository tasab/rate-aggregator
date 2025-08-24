'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rate_currency', {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add unique constraint for the combination
    await queryInterface.addIndex('rate_currency', ['rate_id', 'currency_id'], {
      unique: true,
      name: 'rate_currency_unique',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rate_currency');
  },
};
