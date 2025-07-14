import db from '../models/index.js';
import { getRateSourceController } from '../utils/getRateSourceController.js';

export async function fetchRawRatesFromSources() {
  console.log('🚀 Starting rate fetching job...');

  try {
    const rateSources = await db.RateSource.findAll({
      where: {
        link: { [db.Sequelize.Op.ne]: null }, // тільки ті, що мають link
      },
    });

    console.log(`📊 Found ${rateSources.length} rate sources`);

    for (const source of rateSources) {
      try {
        await fetchFromSingleSource(source);
        console.log(`✅ Successfully fetched from ${source.name}`);
      } catch (error) {
        console.error(`❌ Error fetching from ${source.name}:`, error.message);
      }
    }
  } catch (error) {
    console.error('🔥 Fatal error in rate fetching job:', error);
  }
}

async function fetchFromSingleSource(rateSource) {
  console.log(`🔄 Fetching rates from ${rateSource.name}...`);

  const controller = getRateSourceController(rateSource.type);

  if (!controller) {
    throw new Error(`No controller found for type: ${rateSource.type}`);
  }

  // Створюємо mockReq як очікує оновлений getMinFinRate
  const mockReq = {
    query: { url: rateSource.link },
    rateSource: rateSource,
  };

  let rates = null;
  const mockRes = {
    status: (code) => ({
      json: (data) => {
        if (code === 200) {
          rates = data;
        } else {
          throw new Error(`API returned ${code}: ${JSON.stringify(data)}`);
        }
      },
    }),
  };

  await controller(mockReq, mockRes);

  if (!rates) {
    throw new Error('No rates received from controller');
  }

  await saveRatesToDatabase(rateSource.id, rates);
  console.log(
    `💾 Saved ${Object.keys(rates).length} rates for ${rateSource.name}`
  );
}

async function saveRatesToDatabase(rateSourceId, rates) {
  const fetchedAt = new Date();
  const dataToInsert = [];

  for (const [currencyCode, rateData] of Object.entries(rates)) {
    dataToInsert.push({
      rateSourceId,
      currencyCode,
      bidRate: rateData.bid,
      sellRate: rateData.sell,
      fetchedAt,
      rawData: JSON.stringify(rateData),
      createdAt: fetchedAt,
      updatedAt: fetchedAt,
    });
  }

  await db.RateSourceData.bulkCreate(dataToInsert, {
    ignoreDuplicates: true,
  });
}
