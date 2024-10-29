// const bcrypt = require('bcryptjs'); USAR EN EL MODELO DE USUARIO
const { DataTypes } = require('sequelize');

const Locker = sequelize.define('lockers', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    description: DataTypes.STRING,
    number: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Locker




