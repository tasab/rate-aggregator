'use strict';

const { AVAILABLE_CURRENCIES } = require('../seedersMock/demo-currencies.cjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const currencies = AVAILABLE_CURRENCIES.map((currency) => ({
      id: currency.id,
      code: currency.code,
      full_name: currency.fullName,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('currencies', currencies, {});

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('currencies', 'id'),
        COALESCE((SELECT MAX(id) FROM currencies), 1),
        true
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('currencies', 'id'),
        1,
        false
      );
    `);
  },
};
