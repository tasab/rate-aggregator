import browserManager from '../helpers/browserManager.js';

export const withBrowser = (workerFunction) => {
  return async (...args) => {
    let page;
    try {
      page = await browserManager.createPage();

      // Call the worker function with the page as the first argument
      return await workerFunction(page, ...args);
    } catch (error) {
      // Check if browser is healthy, restart if needed
      if (!(await browserManager.isHealthy())) {
        console.log('Browser unhealthy, restarting...');
        await browserManager.restart();
      }
      throw error;
    } finally {
      // Always close the page
      if (page) {
        await browserManager.closePage(page);
      }
    }
  };
};
