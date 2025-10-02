import { rateSourceUpdateHook } from './rateSourceUpdateHook.js';
import { userRateUpdateHook } from './userRateUpdateHook.js';

export const associateModels = (db) => {
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

export const registerHooks = (db) => {
  db.RateSource.addHook('afterUpdate', rateSourceUpdateHook);
  db.UserRate.addHook('afterUpdate', userRateUpdateHook);
};
