'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'rate_source_orders',
      [
        {
          id: 1,
          name: 'Main Exchange Point',
          status: 'APPROVED',
          city: 'Warsaw',
          link: 'https://example-exchange.com',
          phone_number: '+48123456789',
          description: 'Main currency exchange point in Warsaw city center',
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'City Bank Branch',
          status: 'PENDING',
          city: 'Krakow',
          link: 'https://citybank.com',
          phone_number: '+48987654321',
          description: 'Bank branch with currency exchange services',
          user_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'Airport Exchange',
          status: 'DECLINED',
          city: 'Gdansk',
          link: null,
          phone_number: '+48555666777',
          description: 'Currency exchange at the airport',
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_source_orders', 'id'), COALESCE((SELECT MAX(id) FROM rate_source_orders), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rate_source_orders', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_source_orders', 'id'), 1, false);"
    );
  },
};
