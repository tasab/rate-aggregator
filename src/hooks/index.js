import { processRateSourceUpdate } from './processRateSourceUpdate.js';
import { processRateUpdate } from './processRateUpdate.js';

export const associateModels = (db) => {
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

export const registerHooks = (db) => {
  db.RateSource.addHook('afterUpdate', processRateSourceUpdate);
  db.Rate.addHook('afterUpdate', processRateUpdate);
};
