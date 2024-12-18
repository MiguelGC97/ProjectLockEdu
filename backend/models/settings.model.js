const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Settings = sequelize.define("settings", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        value: DataTypes.STRING,
    });

    return Settings;
};