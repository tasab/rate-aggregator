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
      currencyCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      bidRate: {
        type: DataTypes.DECIMAL(15, 6),
        allowNull: false,
      },
      sellRate: {
        type: DataTypes.DECIMAL(15, 6),
        allowNull: false,
      },
      fetchedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      rawData: {
        type: DataTypes.TEXT,
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
  };

  return RateSourceData;
};
