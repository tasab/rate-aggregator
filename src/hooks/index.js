import { processRateSourceUpdateHook } from './processRateSourceUpdateHook.js';
import { processRateUpdateHook } from './processRateUpdateHook.js';

export const associateModels = (db) => {
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

export const registerHooks = (db) => {
  db.RateSource.addHook('afterUpdate', processRateSourceUpdateHook);
  db.Rate.addHook('afterUpdate', processRateUpdateHook);
};
