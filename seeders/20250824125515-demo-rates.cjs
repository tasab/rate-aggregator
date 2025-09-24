'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'rates',
      [
        {
          id: 1,
          name: 'NBP USD Rate',
          user_id: 1,
          rate_source_id: 1,
          last_updated_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'PKO EUR Rate',
          user_id: 2,
          rate_source_id: 2,
          last_updated_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'Private Exchange GBP',
          user_id: 2,
          rate_source_id: 3,
          last_updated_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          name: 'Cantor Multi Currency',
          user_id: 3,
          rate_source_id: 3,
          last_updated_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rates', 'id'), COALESCE((SELECT MAX(id) FROM rates), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rates', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rates', 'id'), 1, false);"
    );
  },
};
