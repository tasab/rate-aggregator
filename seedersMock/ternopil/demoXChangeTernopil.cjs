const {
  USD,
  EUR,
  PLN,
  GBP,
  CHF,
  CAD,
  SEK,
  CZK,
  DKK,
  NOK,
} = require('../demo-currencies.cjs');
const currencies = [USD, EUR, PLN, GBP, CAD, CHF, SEK, NOK, DKK, CZK];

module.exports = {
  id: 8,
  name: 'X-Change, Тернопіль',
  type: 'CANTOR',
  controller_type: 'X_CHANGE',
  location: 'Тернопіль',
  link: 'https://x-change-x.com/ternopil/',
  rate_source_order_id: null,
  currency_count: currencies.length,
  created_at: new Date(),
  updated_at: new Date(),
  new_updated_at: new Date(),
  prev_updated_at: new Date(),
  currencies: currencies,
};
