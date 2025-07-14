import {
  ROUND_DEFAULT,
  ROUND_DOWN,
  ROUND_UP,
} from '../constants/roundingType.js';

export default (sequelize, DataTypes) => {
  const CurrencyRateConfig = sequelize.define(
    'CurrencyRateConfig',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      effectiveFrom: { type: DataTypes.DATE, allowNull: false },
      effectiveTo: { type: DataTypes.DATE, allowNull: true },
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
    },
    {
      tableName: 'currency_rate_configs',
      timestamps: true,
      underscored: true,
    }
  );

  CurrencyRateConfig.associate = (models) => {
    CurrencyRateConfig.belongsTo(models.Rate, { foreignKey: 'rateId' });
    CurrencyRateConfig.belongsTo(models.Currency, {
      foreignKey: 'currencyId',
      as: 'currency',
    });
  };

  return CurrencyRateConfig;
};
