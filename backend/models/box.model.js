const { DataTypes } = require('sequelize');

const Box = sequelize.define('boxes', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    description: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
});

module.exports = Box