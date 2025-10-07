'use strict';

const rateSources = require('../seedersMock/demo-rate-sources.cjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // === Insert rate_sources ===
    const rateSourceRecords = rateSources.map((src) => ({
      id: src.id,
      name: src.name,
      type: src.type,
      controller_type: src.controller_type,
      location: src.location,
      link: src.link,
      rate_source_order_id: src.rate_source_order_id,
      currency_count: src.currency_count,
      created_at: src.created_at || now,
      updated_at: src.updated_at || now,
      new_updated_at: src.new_updated_at || now,
      prev_updated_at: src.prev_updated_at || now,
    }));

    await queryInterface.bulkInsert('rate_sources', rateSourceRecords, {});

    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('rate_sources', 'id'),
      COALESCE((SELECT MAX(id) FROM rate_sources), 1), true);
    `);

    // === Insert rate_source_currency ===
    let id = 1;
    const rateSourceCurrencyRecords = [];

    for (const src of rateSources) {
      if (!src.currencies) continue;

      for (const currency of src.currencies) {
        // Assuming currency is an object with `id` property
        rateSourceCurrencyRecords.push({
          id: id++,
          rate_source_id: src.id,
          currency_id: currency.id,
          created_at: now,
          updated_at: now,
        });
      }
    }

    await queryInterface.bulkInsert(
      'rate_source_currency',
      rateSourceCurrencyRecords,
      {}
    );

    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('rate_source_currency', 'id'),
      COALESCE((SELECT MAX(id) FROM rate_source_currency), 1), true);
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rate_source_currency', null, {});
    await queryInterface.bulkDelete('rate_sources', null, {});

    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('rate_sources', 'id'), 1, false);
    `);
    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('rate_source_currency', 'id'), 1, false);
    `);
  },
};
