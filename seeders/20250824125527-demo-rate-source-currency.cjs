'use strict';

module.exports = {
  async up(queryInterface) {
    const records = [];
    let id = 1;

    // Add rate source 4 with currencies 1, 2, and 4
    const currencyIdsNBU = [1, 2, 4];
    for (const currencyId of currencyIdsNBU) {
      records.push({
        id: id++,
        rate_source_id: 1,
        currency_id: currencyId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Add rate source 4 with currencies 1, 2, and 4
    const currencyIdsPrivateBank = [1, 2, 4];
    for (const currencyId of currencyIdsPrivateBank) {
      records.push({
        id: id++,
        rate_source_id: 2,
        currency_id: currencyId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Add rate source 4 with currencies 1, 2, and 4
    const currencyIdsGoverla = [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13];
    for (const currencyId of currencyIdsGoverla) {
      records.push({
        id: id++,
        rate_source_id: 3,
        currency_id: currencyId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Create all combinations of 3 rate sources and 9 currencies
    for (let rateSourceId = 4; rateSourceId <= 6; rateSourceId++) {
      for (let currencyId = 1; currencyId <= 9; currencyId++) {
        records.push({
          id: id++,
          rate_source_id: rateSourceId,
          currency_id: currencyId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('rate_source_currency', records, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_source_currency', 'id'), COALESCE((SELECT MAX(id) FROM rate_source_currency), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rate_source_currency', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_source_currency', 'id'), 1, false);"
    );
  },
};
