export default (sequelize, DataTypes) => {
  const RateSourceData = sequelize.define(
    'RateSourceData',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rateSourceId: {
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
      fetchedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'rate_source_data',
      timestamps: true,
      underscored: true,
    }
  );

  RateSourceData.associate = (models) => {
    RateSourceData.belongsTo(models.RateSource, {
      foreignKey: 'rateSourceId',
      as: 'rateSource',
    });

    RateSourceData.hasMany(models.CalculatedRate, {
      foreignKey: 'sourceRateDataId',
      as: 'calculatedRates',
    });
  };

  return RateSourceData;
};
