export default (sequelize, DataTypes) => {
  const CalculatedRate = sequelize.define(
    'CalculatedRate',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      bid: {
        type: DataTypes.DECIMAL(15, 6),
        allowNull: true,
      },
      sell: {
        type: DataTypes.DECIMAL(15, 6),
        allowNull: true,
      },
      sourceRateDataId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      calculatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'calculated_rates',
      timestamps: true,
      underscored: true,
    }
  );

  CalculatedRate.associate = (models) => {
    CalculatedRate.belongsTo(models.UserRate, {
      foreignKey: 'rateId',
      as: 'rate',
    });

    CalculatedRate.belongsTo(models.RateSourceData, {
      foreignKey: 'sourceRateDataId',
      as: 'sourceRateData',
    });
  };

  return CalculatedRate;
};
