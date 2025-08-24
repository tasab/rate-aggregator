'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'rate_sources',
      [
        {
          id: 1,
          name: 'Чорновола 16а жк АВАЛОН позаду ашану',
          type: 'CANTOR',
          controller_type: 'MIN_FIN',
          location: 'Львів',
          link: 'https://minfin.com.ua/ua/currency/auction/exchanger/lvov/id-65084aba0fbd2e124c3b35f0',
          rate_source_order_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'Шпитальна 1, ТЦ Магнус',
          type: 'CANTOR',
          controller_type: 'MIN_FIN',
          location: 'Львів',
          link: 'https://minfin.com.ua/ua/currency/auction/exchanger/lvov/id-61af32f4b6846a2aebffa9f3/',
          rate_source_order_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'Гетьмана Мазепи 1Б',
          type: 'CANTOR',
          controller_type: 'MIN_FIN',
          location: 'Львів',
          link: 'https://minfin.com.ua/ua/currency/auction/exchanger/lvov/id-5fc7cf8ee9c1c043cfccb77c/',
          rate_source_order_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_sources', 'id'), COALESCE((SELECT MAX(id) FROM rate_sources), 1), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rate_sources', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('rate_sources', 'id'), 1, false);"
    );
  },
};
