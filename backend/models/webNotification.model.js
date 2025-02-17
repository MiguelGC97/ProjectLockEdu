const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Notification = sequelize.define('webNotifications', {
        endpoint: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        keys: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    });
    return Notification;
}