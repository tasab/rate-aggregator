import { Router } from 'express';
import db from '../models/index.js';
import configFile from '../../config/database.js';

const dbRouter = Router();

dbRouter.get('/health', async (req, res) => {
  const env = process.env.RAILWAY_ENVIRONMENT
    ? 'production'
    : process.env.NODE_ENV || 'development';
  const config = configFile[env];

  try {
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔍 RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
    console.log('🔍 Detected env:', env);
    console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('🔍 Config:', { ...config, password: '[HIDDEN]' });
    console.log('🔍 Sequelize config:', {
      host: db.sequelize.config?.host,
      database: db.sequelize.config?.database,
      dialect: db.sequelize.config?.dialect,
    });

    await db.sequelize.authenticate();

    const [results] = await db.sequelize.query('SELECT 1 as test');

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        host: db.sequelize.config.host,
        database: db.sequelize.config.database,
        dialect: db.sequelize.config.dialect,
        test_query: results[0],
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        detected_env: env,
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
        DATABASE_URL_preview:
          process.env.DATABASE_URL?.substring(0, 30) + '...',
      },
      config_debug: {
        config_env: env,
        use_env_variable: config.use_env_variable,
        config_host: config.host || 'not_set',
        config_database: config.database || 'not_set',
      },
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'ERROR',
      database: {
        status: 'disconnected',
        error: error.message,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        detected_env: env,
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
        DATABASE_URL_preview:
          process.env.DATABASE_URL?.substring(0, 30) + '...',
      },
      config_debug: {
        config_env: env,
        use_env_variable: config.use_env_variable,
        config_host: config.host || 'not_set',
        config_database: config.database || 'not_set',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

dbRouter.get('/info', async (req, res) => {
  try {
    // Детальна інформація про БД
    const dbInfo = await db.sequelize.query(`
      SELECT 
        current_database() as database_name,
        current_user as user_name,
        version() as postgres_version,
        now() as server_time
    `);

    res.json({
      database_info: dbInfo[0][0],
      connection_config: {
        host: db.sequelize.config.host,
        port: db.sequelize.config.port,
        database: db.sequelize.config.database,
        dialect: db.sequelize.config.dialect,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
      },
    });
  }
});

// Додатковий debug endpoint
dbRouter.get('/debug', (req, res) => {
  const env = process.env.RAILWAY_ENVIRONMENT
    ? 'production'
    : process.env.NODE_ENV || 'development';
  const config = configFile[env];

  res.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      detected_env: env,
      all_env_vars: Object.keys(process.env).filter(
        (key) =>
          key.includes('DB') ||
          key.includes('DATABASE') ||
          key.includes('NODE_ENV') ||
          key.includes('RAILWAY')
      ),
    },
    database: {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_preview: process.env.DATABASE_URL?.substring(0, 50) + '...',
      config_for_env: {
        ...config,
        password: config.password ? '[HIDDEN]' : 'not_set',
      },
    },
    sequelize: {
      host: db.sequelize?.config?.host,
      database: db.sequelize?.config?.database,
      dialect: db.sequelize?.config?.dialect,
      port: db.sequelize?.config?.port,
    },
  });
});

export default dbRouter;
