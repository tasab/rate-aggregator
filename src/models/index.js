import Sequelize, { DataTypes } from 'sequelize';
import config from 'config';

import UserModel from './userModel.js';
import UserRateModel from './userRateModel.js';
import CurrencyModel from './currencyModel.js';
import RateSourceModel from './rateSourceModel.js';
import RateCurrencyConfigModel from './rateCurrencyConfigModel.js';
import RateSourceOrderModer from './rateSourceOrderModel.js';
import RateSourceDataModel from './rateSourceDataModel.js';
import CalculatedRateModel from './calculatedRateModel.js';
import TelegramConfigModel from './telegramConfigModel.js';
import { associateModels, registerHooks } from '../hooks/index.js';

const db = {};

// Create Sequelize instance with environment-specific config
const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  config.database
);

// Add connection event listeners for monitoring
sequelize.addHook('beforeConnect', () => {
  console.log('Attempting to connect to database...');
});

sequelize.addHook('afterConnect', () => {
  console.log('Database connection established');
});

sequelize.addHook('beforeDisconnect', () => {
  console.log('Disconnecting from database...');
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

db.User = UserModel(sequelize, DataTypes);
db.Currency = CurrencyModel(sequelize, DataTypes);
db.UserRate = UserRateModel(sequelize, DataTypes);
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

// Add graceful shutdown handlers
const gracefulShutdown = async () => {
  console.log('Closing database connections...');
  try {
    await sequelize.close();
    console.log('Database connections closed successfully.');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default db;
