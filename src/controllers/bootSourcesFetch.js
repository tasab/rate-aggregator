import { fetchRawRatesFromSources } from '../helpers/fetchRates.js';

export const bootSourcesFetch = async (req, res) => {
  try {
    await fetchRawRatesFromSources();

    return res.json(true);
  } catch (error) {
    return res.status(500).json({
      message: error?.message,
    });
  }
};
