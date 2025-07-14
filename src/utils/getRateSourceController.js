import { MIN_FIN } from '../constants/rateSourceTypes.js';
import { getMinFinRate } from '../controllers/minFin/getMinFinRate.js';

export const getRateSourceController = (controllerType) => {
  switch (controllerType) {
    case MIN_FIN:
      return getMinFinRate;
    default:
      return getMinFinRate;
  }
};
