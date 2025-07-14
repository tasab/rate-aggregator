export default (sequelize, DataTypes) => {
  const Currency = sequelize.define(
    'Currency',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'currencies',
      timestamps: true,
      underscored: true,
    }
  );

  Currency.associate = (models) => {
    Currency.belongsToMany(models.Rate, {
      through: 'rate_currency',
      foreignKey: 'currencyId',
      as: 'rates',
    });

    Currency.hasMany(models.CurrencyRateConfig, {
      foreignKey: 'currencyId',
      as: 'currencyConfigs',
    });

    Currency.belongsToMany(models.RateSource, {
      through: 'rate_source_currency', // Must match the join table name in RateSource
      foreignKey: 'currencyId', // Foreign key for Currency in the join table
      otherKey: 'rateSourceId', // Foreign key for RateSource in the join table
      as: 'rateSources', // Alias for the association
    });
  };

  return Currency;
};
