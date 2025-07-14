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
      rateSourceOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    });
    RateSource.belongsToMany(models.Currency, {
      through: 'rate_source_currency', // Name of the join table
      foreignKey: 'rateSourceId', // Foreign key for RateSource in the join table
      otherKey: 'currencyId', // Foreign key for Currency in the join table
      as: 'currencies', // Alias for the association
    });
    RateSource.hasMany(models.RateSourceData, {
      foreignKey: 'rateSourceId',
      as: 'rateData',
      onDelete: 'CASCADE',
    });
  };

  return RateSource;
};
