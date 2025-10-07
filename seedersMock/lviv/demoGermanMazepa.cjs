const {
  USD,
  EUR,
  GBP,
  CHF,
  CAD,
  PLN,
  HUF,
  CZK,
  SEK,
  NOK,
  DKK,
} = require('../demo-currencies.cjs');
const currencies = [USD, EUR, PLN, GBP, CHF, CAD, DKK, NOK, SEK, CZK, HUF];

module.exports = {
  id: 5,
  name: 'Пункт обміну, вул. Гетьмана Мазепи 1Б',
  type: 'CANTOR',
  controller_type: 'MIN_FIN',
  location: 'Львів',
  link: 'https://minfin.com.ua/ua/currency/auction/exchanger/lvov/id-5fc7cf8ee9c1c043cfccb77c/',
  rate_source_order_id: null,
  currency_count: currencies.length,
  created_at: new Date(),
  updated_at: new Date(),
  new_updated_at: new Date(),
  prev_updated_at: new Date(),
  currencies: currencies,
};
