'use strict';

module.exports = {
  async up(queryInterface) {
    const records = [];
    let id = 1;

    // Create all combinations of 3 rates and 9 currencies
    for (let rateId = 1; rateId <= 3; rateId++) {
      for (let currencyId = 1; currencyId <= 9; currencyId++) {
        records.push({
          id: id++,
          rate_id: rateId,
          currency_id: currencyId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('rate_currency', records, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_currency', 'id'), COALESCE((SELECT MAX(id) FROM rate_currency), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rate_currency', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_currency', 'id'), 1, false);"
    );
  },
};
