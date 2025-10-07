const { AVAILABLE_CURRENCIES } = require('../demo-currencies.cjs');

module.exports = {
  id: 3,
  name: 'НБУ Національний Банк України',
  type: 'BANK',
  controller_type: 'NBU',
  location: 'Україна',
  link: 'https://bank.gov.ua/en/markets/exchangerates',
  rate_source_order_id: null,
  currency_count: AVAILABLE_CURRENCIES.length,
  created_at: new Date(),
  updated_at: new Date(),
  new_updated_at: new Date(),
  prev_updated_at: new Date(),
  currencies: AVAILABLE_CURRENCIES,
};
