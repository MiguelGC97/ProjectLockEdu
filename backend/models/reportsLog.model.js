const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Report = sequelize.define("reports", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  });

  return Report;
};
