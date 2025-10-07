const {
  USD,
  EUR,
  GBP,
  CHF,
  CAD,
  AUD,
  PLN,
  HUF,
  CZK,
  CNY,
  TRY,
  ILS,
} = require('../demo-currencies.cjs');

const currencies = [USD, EUR, PLN, GBP, CHF, CAD, ILS, AUD, TRY, CNY, CZK, HUF];

module.exports = {
  id: 6,
  name: 'Пункт обміну Львів, вул. Василя Стефаника 15',
  type: 'CANTOR',
  controller_type: 'MIN_FIN',
  location: 'Львів',
  link: 'https://minfin.com.ua/ua/currency/auction/exchanger/lvov/id-65084aba0fbd2e124c3b35f0',
  rate_source_order_id: null,
  currency_count: currencies.length,
  created_at: new Date(),
  updated_at: new Date(),
  new_updated_at: new Date(),
  prev_updated_at: new Date(),
  currencies: currencies,
};
