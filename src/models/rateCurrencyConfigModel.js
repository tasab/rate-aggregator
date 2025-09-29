import {
  ROUND_DEFAULT,
  ROUND_DOWN,
  ROUND_UP,
} from '../constants/roundingType.js';

export default (sequelize, DataTypes) => {
  const RateCurrencyConfig = sequelize.define(
    'RateCurrencyConfig',
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
      currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bidMargin: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: -0.1,
      },
      bidShouldRound: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bidRoundingDepth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      bidRoundingType: {
        type: DataTypes.ENUM(ROUND_UP, ROUND_DOWN, ROUND_DEFAULT),
        allowNull: false,
        defaultValue: ROUND_DEFAULT,
      },
      sellMargin: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0.1,
      },
      sellShouldRound: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sellRoundingDepth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      sellRoundingType: {
        type: DataTypes.ENUM(ROUND_UP, ROUND_DOWN, ROUND_DEFAULT),
        allowNull: false,
        defaultValue: ROUND_DEFAULT,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'rate_currency_configs',
      timestamps: true,
      underscored: true,
    }
  );

  RateCurrencyConfig.associate = (models) => {
    RateCurrencyConfig.belongsTo(models.Rate, { foreignKey: 'rateId' });
    RateCurrencyConfig.belongsTo(models.Currency, {
      foreignKey: 'currencyId',
      as: 'currency',
    });
  };

  return RateCurrencyConfig;
};
