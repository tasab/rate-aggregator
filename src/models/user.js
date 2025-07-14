export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Rate, { foreignKey: 'userId' });
    User.hasMany(models.RateSourceOrder, {
      foreignKey: 'userId',
      as: 'rateSourceOrders',
    });
  };

  return User;
};
