// telegramConfigModel.js
export default (sequelize, DataTypes) => {
  const TelegramConfig = sequelize.define(
    'TelegramConfig',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // One-to-one relationship
      },
      botToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chatId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      messageHeader: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      messageFooter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isConnected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      notificationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      enableTrend: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      tableName: 'telegram_configs',
      timestamps: true,
      underscored: true,
    }
  );

  TelegramConfig.associate = (models) => {
    TelegramConfig.belongsTo(models.UserRate, {
      foreignKey: 'rateId',
      as: 'rate',
    });
  };

  return TelegramConfig;
};
