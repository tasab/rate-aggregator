import Sequelize, { DataTypes } from 'sequelize';
import config from 'config';

import UserModel from './userModel.js';
import RateModel from './rateModel.js';
import CurrencyModel from './currencyModel.js';
import RateSourceModel from './rateSourceModel.js';
import CurrencyRateConfigModel from './currencyRateConfigModel.js';
import RateSourceOrderModer from './rateSourceOrderModel.js';
import RateSourceDataModel from './rateSourceDataModel.js';

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
db.CurrencyRateConfig = CurrencyRateConfigModel(sequelize, DataTypes);
db.RateSourceOrder = RateSourceOrderModer(sequelize, DataTypes);
db.RateSourceData = RateSourceDataModel(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
