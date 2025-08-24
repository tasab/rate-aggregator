import Sequelize, { DataTypes } from 'sequelize';
import configFile from '../../config/database.js';

import UserModel from './user.js';
import RateModel from './rate.js';
import CurrencyModel from './currency.js';
import RateSourceModel from './rateSource.js';
import CurrencyRateConfigModel from './currencyRateConfig.js';
import RateSourceOrderModer from './rateSourceOrder.js';
import RateSourceDataModel from './rateSourceData.js';

const db = {};

const env = process.env.RAILWAY_ENVIRONMENT
  ? 'production'
  : process.env.NODE_ENV || 'development';
const config = configFile[env];

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    use_env_variable: undefined, // видаляємо цей ключ з опцій
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

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
