module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'funds',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payout: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
