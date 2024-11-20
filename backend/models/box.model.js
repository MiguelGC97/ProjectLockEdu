const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Box = sequelize.define('boxes', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        locker_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: DataTypes.STRING,
        imgUrl: DataTypes.STRING,
    });

    return Box;
};