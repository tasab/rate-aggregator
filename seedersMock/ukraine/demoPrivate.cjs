const { EUR, USD, PLN } = require('../demo-currencies.cjs');
const currencies = [EUR, USD, PLN];
module.exports = {
  id: 1,
  name: 'Приват банк',
  type: 'BANK',
  controller_type: 'PRIVATE_BANK',
  location: 'Україна',
  link: 'https://privatbank.ua/obmin-valiut',
  rate_source_order_id: null,
  currency_count: currencies.length,
  created_at: new Date(),
  updated_at: new Date(),
  new_updated_at: new Date(),
  prev_updated_at: new Date(),
  currencies: currencies,
};
