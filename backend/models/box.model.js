const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Box = sequelize.define('boxes', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // lockerId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // }, PREGUNTAR A SARA
        description: DataTypes.STRING,
        filename: DataTypes.STRING,
    });

    return Box;
}