const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Type = sequelize.define('types', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        typeName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    });

  return Type;
};
