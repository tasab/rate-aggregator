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
    Currency.hasMany(models.RateCurrencyConfig, {
      foreignKey: 'currencyId',
      as: 'currencyConfigs',
    });

    Currency.belongsToMany(models.RateSource, {
      through: 'rate_source_currency',
      foreignKey: 'currencyId',
      otherKey: 'rateSourceId',
      as: 'rateSources',
    });
  };

  return Currency;
};
