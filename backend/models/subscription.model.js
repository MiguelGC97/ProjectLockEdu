const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Subscription = sequelize.define("subscriptions", {
        endpoint: {
            type: DataTypes.TEXT,
        },
        expirationTime: {
            type: DataTypes.INTEGER,
        },
        keys: {
            type: DataTypes.STRING,
        },
        subscriptionName: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
    });

    return Subscription;
};
