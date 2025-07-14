import puppeteer from 'puppeteer';

export const getMinFinRate = async (req, res) => {
  try {
    const rateSource = req.rateSource || req.body?.rateSource;
    const url = req.query?.url || req.rateSource?.link || req.body?.url;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
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
      parsedInitialState?.props?.initialState?.operations?.operation
        ?.branchRates;

    if (!branchRates || !Array.isArray(branchRates)) {
      return res
        .status(500)
        .json({ error: 'Invalid data structure from MinFin' });
    }

    // 🔧 Конвертуємо числа одразу тут
    const rates = {};
    branchRates.forEach((item) => {
      const code = item.currency.toUpperCase();
      rates[code] = {
        bid: parseFloat(String(item.rate.buy.value).replace(',', '.')),
        sell: parseFloat(String(item.rate.sell.value).replace(',', '.')),
        updated: item._updated,
      };
    });

    return res.status(200).json(rates);
  } catch (error) {
    console.error('Error in getMinFinRate:', error);
    return res.status(500).json({ error: 'Failed to fetch rates from MinFin' });
  }
};
