const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const teacher = sequelize.define("teacher", {
    shift: {
      type: DataTypes.ENUM("mañana", "tarde"),
      allowNull: false,
      validate: {
        isIn: [["mañana", "tarde"]],
      },
    },
  });

  return teacher;
};
