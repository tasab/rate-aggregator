import { MIN_FIN, NBU, PRIVATE_BANK } from '../constants/rateSourceTypes.js';
import { minFinWorker } from '../workers/minFinWorker.js';
import { privateBankWorker } from '../workers/privateBankWorker.js';
import { nbuWorker } from '../workers/nbuWorker.js';

export const getRateSourceController = (controllerType) => {
  switch (controllerType) {
    case MIN_FIN:
      return minFinWorker;
    case PRIVATE_BANK:
      return privateBankWorker;
    case NBU:
      return nbuWorker;
    default:
      return minFinWorker;
  }
};
