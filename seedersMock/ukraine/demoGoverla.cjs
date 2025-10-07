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
  JPY,
  CNY,
} = require('../demo-currencies.cjs');
const currencies = [USD, EUR, GBP, CHF, CAD, AUD, PLN, HUF, CZK, JPY, CNY];
module.exports = {
  id: 2,
  name: 'Говерла',
  type: 'CANTOR',
  controller_type: 'GOVERLA',
  location: 'Україна',
  link: 'https://goverla.ua/',
  rate_source_order_id: null,
  currency_count: currencies.length,
  created_at: new Date(),
  updated_at: new Date(),
  new_updated_at: new Date(),
  prev_updated_at: new Date(),
  currencies: currencies,
};
