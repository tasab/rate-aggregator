import Sequelize, { DataTypes } from 'sequelize';
import config from 'config';

import UserModel from './userModel.js';
import RateModel from './rateModel.js';
import CurrencyModel from './currencyModel.js';
import RateSourceModel from './rateSourceModel.js';
import RateCurrencyConfigModel from './rateCurrencyConfigModel.js';
import RateSourceOrderModer from './rateSourceOrderModel.js';
import RateSourceDataModel from './rateSourceDataModel.js';
import CalculatedRateModel from './calculatedRateModel.js';
import TelegramConfigModel from './telegramConfigModel.js';
import { associateModels, registerHooks } from '../hooks/index.js';

const db = {};

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  config.database
);

db.User = UserModel(sequelize, DataTypes);
db.Currency = CurrencyModel(sequelize, DataTypes);
db.Rate = RateModel(sequelize, DataTypes);
db.RateSource = RateSourceModel(sequelize, DataTypes);
db.RateCurrencyConfig = RateCurrencyConfigModel(sequelize, DataTypes);
db.RateSourceOrder = RateSourceOrderModer(sequelize, DataTypes);
db.RateSourceData = RateSourceDataModel(sequelize, DataTypes);
db.CalculatedRate = CalculatedRateModel(sequelize, DataTypes);
db.TelegramConfig = TelegramConfigModel(sequelize, DataTypes);

associateModels(db);
registerHooks(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
