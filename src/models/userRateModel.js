export default (sequelize, DataTypes) => {
  const UserRate = sequelize.define(
    'UserRate',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rateSourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isPrivateRate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      startWorkingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      endWorkingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      newUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      prevUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'user_rates',
      timestamps: true,
      underscored: true,
    }
  );

  UserRate.associate = (models) => {
    UserRate.belongsTo(models.User, { foreignKey: 'userId' });
    UserRate.belongsTo(models.RateSource, {
      foreignKey: 'rateSourceId',
      as: 'rateSource',
    });
    UserRate.hasMany(models.RateCurrencyConfig, {
      foreignKey: 'rateId',
      as: 'currencyConfigs',
      onDelete: 'CASCADE',
    });

    UserRate.hasOne(models.TelegramConfig, {
      foreignKey: 'rateId',
      as: 'telegramConfig',
      onDelete: 'CASCADE',
    });
  };

  return UserRate;
};
