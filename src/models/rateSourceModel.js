export default (sequelize, DataTypes) => {
  const RateSource = sequelize.define(
    'RateSource',
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
      type: {
        type: DataTypes.ENUM('PRIVATE', 'BANK', 'CANTOR'),
        allowNull: false,
        defaultValue: 'CANTOR',
      },
      controllerType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastProcessedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rateSourceOrderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
    },
    {
      tableName: 'rate_sources',
      timestamps: true,
      underscored: true,
    }
  );

  RateSource.associate = (models) => {
    RateSource.hasMany(models.Rate, { foreignKey: 'rateSourceId' });
    RateSource.belongsTo(models.RateSourceOrder, {
      foreignKey: 'rateSourceOrderId',
      as: 'rateSourceOrder',
      onDelete: 'SET NULL',
    });
    RateSource.belongsToMany(models.Currency, {
      through: 'rate_source_currency',
      foreignKey: 'rateSourceId',
      otherKey: 'currencyId',
      as: 'currencies',
    });
    RateSource.hasMany(models.RateSourceData, {
      foreignKey: 'rateSourceId',
      as: 'rateData',
      onDelete: 'CASCADE',
    });
  };

  return RateSource;
};
