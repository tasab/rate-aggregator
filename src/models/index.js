import Sequelize, { DataTypes } from 'sequelize';
import config from 'config';

import UserModel from './user.js';
import RateModel from './rate.js';
import CurrencyModel from './currency.js';
import RateSourceModel from './rateSource.js';
import CurrencyRateConfigModel from './currencyRateConfig.js';
import RateSourceOrderModer from './rateSourceOrder.js';
import RateSourceDataModel from './rateSourceData.js';

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
