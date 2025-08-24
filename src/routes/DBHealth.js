import { Router } from 'express';
import db from '../models/index.js';

const dbRouter = Router();

dbRouter.get('/health', async (req, res) => {
  try {
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
      environment: process.env.NODE_ENV,
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
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default dbRouter;
