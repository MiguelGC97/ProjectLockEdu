const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Notification = sequelize.define('notifications', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: DataTypes.STRING,
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        type: DataTypes.ENUM('warning', 'reminder', 'info'),
    });
    return Notification;
}