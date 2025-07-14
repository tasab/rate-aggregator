import db from '../../models/index.js';

export const deleteRate = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Rate ID is required' });
  }

  const rate = await db.Rate.findByPk(id, { transaction });

  if (!rate) {
    return res.status(404).json({ message: 'Rate not found' });
  }

  await rate.destroy({ transaction });

  await transaction.commit();

  res.status(200).json({ message: 'Rate successfully deleted' });
};
