import { DataTypes } from "sequelize";


module.exports = (sequelize) => {
    const Report = sequelize.define("reportLog", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          comment: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        {
          tableName: "reportLog",
          timestamps: true,
        }
      );
  
      return Report;
  };