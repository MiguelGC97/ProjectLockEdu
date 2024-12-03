const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Booking = sequelize.define("bookings", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        description: DataTypes.STRING,
        checkOut: DataTypes.DATE,
        checkIn: DataTypes.DATE,
        state: {
            type: DataTypes.ENUM("pending", "withdrawn", "returned"),
            allowNull: false,
            validate: {
                isIn: {
                    args: [["pending", "withdrawn", "returned"]],
                    msg: "Not a valid value (pending, withdrawn, returned)",
                },
            },
        },
    });

    return Booking;
};
