export default (sequelize, DataTypes) => {
  const RateSourceOrder = sequelize.define(
    'RateSourceOrder',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM('DECLINED', 'PENDING', 'APPROVED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'rate_source_orders',
      timestamps: true,
      underscored: true,
    }
  );

  RateSourceOrder.associate = (models) => {
    RateSourceOrder.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
    RateSourceOrder.hasOne(models.RateSource, {
      foreignKey: 'rateSourceOrderId',
      as: 'rateSource',
      onDelete: 'SET NULL',
    });
  };

  return RateSourceOrder;
};
