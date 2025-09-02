import db from '../models/index.js';
import { LOG_ERROR, LOG_SUCCESS, logger } from '../utils/logger.js';

export const syncDB = (app, port) =>
  db.sequelize
    .sync({ alter: true })
    .then(() => {
      logger(null, 'Database synced', LOG_SUCCESS);
      app.listen(port, () =>
        logger(null, `Server is running at http://localhost:${port}`)
      );
    })
    .catch((error) => logger(error, 'DB sync error', LOG_ERROR));
