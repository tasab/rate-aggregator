const { USD, EUR, GBP, CHF, CAD, PLN, CZK } = require('../demo-currencies.cjs');
const currencies = [USD, EUR, PLN, CHF, GBP, CAD, CZK];
// Start from 4 NBU, GOVERLA, PRIVAT, have go first
module.exports = {
  id: 4,
  name: 'Пункт обміну, бульв. Лесі Українки 15',
  type: 'CANTOR',
  controller_type: 'MIN_FIN',
  location: ' Київ',
  link: 'https://minfin.com.ua/ua/currency/auction/exchanger/kiev/id-6454a377dc180ad6f137b1ea/',
  rate_source_order_id: null,
  currency_count: currencies.length,
  created_at: new Date(),
  updated_at: new Date(),
  new_updated_at: new Date(),
  prev_updated_at: new Date(),
  currencies: currencies,
};
