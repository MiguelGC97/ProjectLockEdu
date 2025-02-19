const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Settings = sequelize.define('settings', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        theme: {
            type: DataTypes.ENUM('light', 'dark'),
            allowNull: false,
            defaultValue: 'dark',
        },
        banner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }

    });

    return Settings;
};
