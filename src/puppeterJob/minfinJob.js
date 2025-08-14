import puppeteer from 'puppeteer';

export const getMinFinInfoJob = async (url) => {
  if (!url) {
    throw new Error('url is required to get min-fin rateSource info');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const pageResult = await page.evaluate(() => {
    const script = document.querySelector('#__NEXT_DATA__');
    return script.innerHTML;
  });

  await browser.close();

  const parsedInitialState = JSON.parse(pageResult);
  const branchRates =
    parsedInitialState?.props?.initialState?.operations?.operation?.branchRates;

  if (!branchRates || !Array.isArray(branchRates)) {
    throw new Error('Invalid data structure from MinFin');
  }

  const rates = {};
  branchRates.forEach((item) => {
    const code = item.currency.toUpperCase();
    rates[code] = {
      bid: parseFloat(String(item.rate.buy.value).replace(',', '.')),
      sell: parseFloat(String(item.rate.sell.value).replace(',', '.')),
      updated: item._updated,
    };
  });

  return rates;
};
