import db from '../../models/index.js';
import { findRateById } from '../../query/rateQueries.js';

export const deleteRate = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Rate ID is required' });
  }

  const rate = await findRateById(id, [], transaction);

  if (!rate) {
    return res.status(404).json({ message: 'Rate not found' });
  }

  await rate.destroy({ transaction });

  await transaction.commit();

  res.status(200).json({ message: 'Rate successfully deleted' });
};
