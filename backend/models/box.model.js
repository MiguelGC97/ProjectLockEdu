const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Box = sequelize.define('boxes', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        description: DataTypes.STRING,
        imgUrl: DataTypes.STRING,
    });

    return Box;
};