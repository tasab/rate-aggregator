import config from 'config';

export default {
  development: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database') + '_test',
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: 'postgres',
    logging: false,
  },
};
