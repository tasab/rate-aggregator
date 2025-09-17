'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rates', 'start_working_time', {
      type: Sequelize.TIME,
      allowNull: true,
    });

    await queryInterface.addColumn('rates', 'end_working_time', {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('rates', 'start_working_time');
    await queryInterface.removeColumn('rates', 'end_working_time');
  },
};
