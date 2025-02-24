const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Item = sequelize.define('items', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        boxId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: DataTypes.STRING,
    });
    return Item;
}