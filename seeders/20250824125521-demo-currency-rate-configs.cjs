'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'currency_rate_configs',
      [
        {
          id: 1,
          effective_from: new Date('2024-01-01'),
          effective_to: new Date('2024-12-31'),
          rate_id: 1,
          currency_id: 1,
          bid_margin: 0.02,
          bid_should_round: true,
          bid_rounding_depth: 2,
          bid_rounding_type: 'ROUND_UP',
          sell_margin: 0.03,
          sell_should_round: true,
          sell_rounding_depth: 2,
          sell_rounding_type: 'ROUND_DOWN',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          effective_from: new Date('2024-01-01'),
          effective_to: new Date('2024-12-31'),
          rate_id: 2,
          currency_id: 2,
          bid_margin: 0.025,
          bid_should_round: true,
          bid_rounding_depth: 2,
          bid_rounding_type: 'ROUND_UP',
          sell_margin: 0.035,
          sell_should_round: true,
          sell_rounding_depth: 2,
          sell_rounding_type: 'ROUND_DOWN',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          effective_from: new Date('2024-01-01'),
          effective_to: new Date('2024-12-31'),
          rate_id: 3,
          currency_id: 3,
          bid_margin: 0.03,
          bid_should_round: true,
          bid_rounding_depth: 3,
          bid_rounding_type: 'ROUND_UP',
          sell_margin: 0.04,
          sell_should_round: true,
          sell_rounding_depth: 3,
          sell_rounding_type: 'ROUND_UP',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          effective_from: new Date('2024-01-01'),
          effective_to: new Date('2024-12-31'),
          rate_id: 4,
          currency_id: 1,
          bid_margin: 0.015,
          bid_should_round: false,
          bid_rounding_depth: 2,
          bid_rounding_type: 'ROUND_UP',
          sell_margin: 0.025,
          sell_should_round: false,
          sell_rounding_depth: 2,
          sell_rounding_type: 'ROUND_UP',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          effective_from: new Date('2024-01-01'),
          effective_to: new Date('2024-12-31'),
          rate_id: 4,
          currency_id: 2,
          bid_margin: 0.02,
          bid_should_round: true,
          bid_rounding_depth: 2,
          bid_rounding_type: 'ROUND_UP',
          sell_margin: 0.03,
          sell_should_round: true,
          sell_rounding_depth: 2,
          sell_rounding_type: 'ROUND_DOWN',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('currency_rate_configs', 'id'), COALESCE((SELECT MAX(id) FROM currency_rate_configs), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('currency_rate_configs', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('currency_rate_configs', 'id'), 1, false);"
    );
  },
};
