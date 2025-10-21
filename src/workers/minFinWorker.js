import { withBrowser } from '../middleware/withBrowser.js';
import { getNumber } from '../utils/numberUtils.js';

const minFinWorkerCore = async (page, rateSource) => {
  const url = rateSource?.link;
  if (!url) {
    throw new Error('URL is required');
  }

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const pageResult = await page.evaluate(() => {
    const script = document.querySelector('#__NEXT_DATA__');
    return script.innerHTML;
  });

  const parsedInitialState = JSON.parse(pageResult);
  const branchRates =
    parsedInitialState?.props?.initialState?.operations?.operation?.branchRates;

  if (!branchRates || !Array.isArray(branchRates)) {
    throw new Error('Invalid data structure from MinFin');
  }

  const rates = [];

  branchRates.forEach((item) => {
    const code = item?.currency?.toLowerCase();
    const updated = item?._updated;

    // Check if bid/sell values exist and are valid
    const bidValue = item?.rate?.buy?.value;
    const sellValue = item?.rate?.sell?.value;

    const bid = getNumber(bidValue);
    const sell = getNumber(sellValue);

    rates.push({
      code: code,
      bid: bid,
      sell: sell,
      updated,
    });
  });

  return rates;
};

export const minFinWorker = withBrowser(minFinWorkerCore);
