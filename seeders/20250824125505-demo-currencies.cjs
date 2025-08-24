'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'currencies',
      [
        {
          id: 1,
          code: 'USD',
          full_name: 'Американьский долар',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          code: 'EUR',
          full_name: 'Euro',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          code: 'GBP',
          full_name: 'British Pound',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          code: 'PLN',
          full_name: 'Polish Zloty',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          code: 'CHF',
          full_name: 'Swiss Franc',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          code: 'CZK',
          full_name: 'Czech Koruna',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 7,
          code: 'NOK',
          full_name: 'Norwegian Krone',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 8,
          code: 'SEK',
          full_name: 'Swedish Krona',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 9,
          code: 'CAD',
          full_name: 'Canadian Dollar',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('currencies', 'id'), COALESCE((SELECT MAX(id) FROM currencies), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('currencies', 'id'), 1, false);"
    );
  },
};
