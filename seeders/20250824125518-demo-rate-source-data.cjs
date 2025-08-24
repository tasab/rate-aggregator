'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'rate_source_data',
      [
        {
          id: 1,
          rate_source_id: 1,
          currency_code: 'USD',
          bid_rate: 4.125,
          sell_rate: 4.185,
          fetched_at: new Date(),
          raw_data: '{"source": "NBP", "table": "A", "no": "001/A/NBP/2024"}',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          rate_source_id: 1,
          currency_code: 'EUR',
          bid_rate: 4.412,
          sell_rate: 4.472,
          fetched_at: new Date(),
          raw_data: '{"source": "NBP", "table": "A", "no": "001/A/NBP/2024"}',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          rate_source_id: 2,
          currency_code: 'USD',
          bid_rate: 4.11,
          sell_rate: 4.2,
          fetched_at: new Date(),
          raw_data: '{"source": "PKO", "page": "currencies"}',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          rate_source_id: 2,
          currency_code: 'EUR',
          bid_rate: 4.4,
          sell_rate: 4.48,
          fetched_at: new Date(),
          raw_data: '{"source": "PKO", "page": "currencies"}',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_source_data', 'id'), COALESCE((SELECT MAX(id) FROM rate_source_data), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rate_source_data', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_source_data', 'id'), 1, false);"
    );
  },
};
