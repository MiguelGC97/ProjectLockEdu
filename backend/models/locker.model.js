const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Locker = sequelize.define("lockers", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    description: DataTypes.STRING,
    number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Locker;
};
