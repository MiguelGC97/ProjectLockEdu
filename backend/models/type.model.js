const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Type = sequelize.define('types', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        typeName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Type;
}

