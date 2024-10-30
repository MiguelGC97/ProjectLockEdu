const { DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true 

    },
    username: { type: DataTypes.STRING, allowNull: false 

    },
    password: { type: DataTypes.STRING, allowNull: false 

    },
    token: { type: DataTypes.STRING 
 },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
