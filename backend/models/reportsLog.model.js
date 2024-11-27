const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ReportsLog = sequelize.define('reportsLog', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        modificationDate: TIMESTAMP,
        managerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return ReportsLog;
}


