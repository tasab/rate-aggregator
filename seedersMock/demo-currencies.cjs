// === Popular & World Currencies ===
const USD = { id: 1, code: 'USD', fullName: 'US Dollar', emoji: '🇺🇸' };
const EUR = { id: 2, code: 'EUR', fullName: 'Euro', emoji: '🇪🇺' };
const GBP = { id: 3, code: 'GBP', fullName: 'Pound Sterling', emoji: '🇬🇧' };
const CHF = { id: 4, code: 'CHF', fullName: 'Swiss Franc', emoji: '🇨🇭' };
const PLN = { id: 5, code: 'PLN', fullName: 'Zloty', emoji: '🇵🇱' };
const CAD = { id: 6, code: 'CAD', fullName: 'Canadian Dollar', emoji: '🇨🇦' };
const AUD = { id: 7, code: 'AUD', fullName: 'Australian Dollar', emoji: '🇦🇺' };
const JPY = { id: 8, code: 'JPY', fullName: 'Yen', emoji: '🇯🇵' };
const CNY = { id: 9, code: 'CNY', fullName: 'Yuan Renminbi', emoji: '🇨🇳' };
const NOK = { id: 10, code: 'NOK', fullName: 'Norwegian Krone', emoji: '🇳🇴' };
const SEK = { id: 11, code: 'SEK', fullName: 'Swedish Krona', emoji: '🇸🇪' };
const DKK = { id: 12, code: 'DKK', fullName: 'Danish Krone', emoji: '🇩🇰' };
const NZD = {
  id: 13,
  code: 'NZD',
  fullName: 'New Zealand Dollar',
  emoji: '🇳🇿',
};
const SGD = { id: 14, code: 'SGD', fullName: 'Singapore Dollar', emoji: '🇸🇬' };
const TRY = { id: 15, code: 'TRY', fullName: 'Turkish Lira', emoji: '🇹🇷' };
const CZK = { id: 16, code: 'CZK', fullName: 'Czech Koruna', emoji: '🇨🇿' };
const HUF = { id: 17, code: 'HUF', fullName: 'Forint', emoji: '🇭🇺' };
const RON = { id: 18, code: 'RON', fullName: 'Romanian Leu', emoji: '🇷🇴' };
const BGN = { id: 19, code: 'BGN', fullName: 'Bulgarian Lev', emoji: '🇧🇬' };
const SAR = { id: 20, code: 'SAR', fullName: 'Saudi Riyal', emoji: '🇸🇦' };
const AED = { id: 21, code: 'AED', fullName: 'UAE Dirham', emoji: '🇦🇪' };
const INR = { id: 22, code: 'INR', fullName: 'Indian Rupee', emoji: '🇮🇳' };
const KZT = { id: 23, code: 'KZT', fullName: 'Tenge', emoji: '🇰🇿' };
const THB = { id: 24, code: 'THB', fullName: 'Baht', emoji: '🇹🇭' };
const MXN = { id: 25, code: 'MXN', fullName: 'Mexican Peso', emoji: '🇲🇽' };
const ZAR = { id: 26, code: 'ZAR', fullName: 'Rand', emoji: '🇿🇦' };
const HKD = { id: 27, code: 'HKD', fullName: 'Hong Kong Dollar', emoji: '🇭🇰' };
const KRW = { id: 28, code: 'KRW', fullName: 'Won', emoji: '🇰🇷' };
const MYR = { id: 29, code: 'MYR', fullName: 'Malaysian Ringgit', emoji: '🇲🇾' };
const ILS = {
  id: 30,
  code: 'ILS',
  fullName: 'New Israeli Sheqel',
  emoji: '🇮🇱',
};
const EGP = { id: 31, code: 'EGP', fullName: 'Egyptian Pound', emoji: '🇪🇬' };
const TND = { id: 32, code: 'TND', fullName: 'Tunisian Dinar', emoji: '🇹🇳' };
const MDL = { id: 33, code: 'MDL', fullName: 'Moldovan Leu', emoji: '🇲🇩' };
const GEL = { id: 34, code: 'GEL', fullName: 'Lari', emoji: '🇬🇪' };
const AZN = { id: 35, code: 'AZN', fullName: 'Azerbaijan Manat', emoji: '🇦🇿' };
const RSD = { id: 36, code: 'RSD', fullName: 'Serbian Dinar', emoji: '🇷🇸' };
const BDT = { id: 37, code: 'BDT', fullName: 'Taka', emoji: '🇧🇩' };
const VND = { id: 38, code: 'VND', fullName: 'Dong', emoji: '🇻🇳' };
const IDR = { id: 39, code: 'IDR', fullName: 'Rupiah', emoji: '🇮🇩' };
const LBP = { id: 40, code: 'LBP', fullName: 'Lebanese Pound', emoji: '🇱🇧' };
const DZD = { id: 41, code: 'DZD', fullName: 'Algerian Dinar', emoji: '🇩🇿' };
const XDR = {
  id: 42,
  code: 'XDR',
  fullName: 'SDR (Special Drawing Right)',
  emoji: '🌍',
};

// === Array of all currencies ===
const AVAILABLE_CURRENCIES = [
  USD,
  EUR,
  GBP,
  CHF,
  PLN,
  CAD,
  AUD,
  JPY,
  CNY,
  NOK,
  SEK,
  DKK,
  NZD,
  SGD,
  TRY,
  CZK,
  HUF,
  RON,
  BGN,
  SAR,
  AED,
  INR,
  KZT,
  THB,
  MXN,
  ZAR,
  HKD,
  KRW,
  MYR,
  ILS,
  EGP,
  TND,
  MDL,
  GEL,
  AZN,
  RSD,
  BDT,
  VND,
  IDR,
  LBP,
  DZD,
  XDR,
];

module.exports = {
  USD,
  EUR,
  GBP,
  CHF,
  PLN,
  CAD,
  AUD,
  JPY,
  CNY,
  NOK,
  SEK,
  DKK,
  NZD,
  SGD,
  TRY,
  CZK,
  HUF,
  RON,
  BGN,
  SAR,
  AED,
  INR,
  KZT,
  THB,
  MXN,
  ZAR,
  HKD,
  KRW,
  MYR,
  ILS,
  EGP,
  TND,
  MDL,
  GEL,
  AZN,
  RSD,
  BDT,
  VND,
  IDR,
  LBP,
  DZD,
  XDR,
  AVAILABLE_CURRENCIES,
};
