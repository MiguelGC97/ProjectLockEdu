const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Report = sequelize.define("reports", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isSolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
  });

  return Report;
};
