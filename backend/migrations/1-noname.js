"use strict";

var Sequelize = require("sequelize");

var info = {
  revision: 1,
  name: "noname",
  created: "2025-02-10T00:59:04.049Z",
  comment: "",
};

var migrationCommands = function (transaction) {
  return [
    {
      fn: "createTable",
      params: [
        "users",
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          surname: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          username: {
            type: DataTypes.STRING,
          },
          avatar: {
            type: DataTypes.STRING,
          },
          role: {
            type: DataTypes.ENUM("TEACHER", "ADMIN", "MANAGER"),
            allowNull: false,
          },
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "bookings",
        {
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
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "boxes",
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },

          description: DataTypes.STRING,
          filename: DataTypes.STRING,
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "items",
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          typeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          boxId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          description: DataTypes.STRING,
          state: DataTypes.ENUM("booked", "available"),
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "lockers",
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          description: DataTypes.STRING,
          number: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          location: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "notifications",
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
          type: {
            type: DataTypes.ENUM("warning", "reminder", "info"),
            allowNull: false,
          },
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "reports",
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },

          content: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          isSolved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
          },
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "reportlog",
        {
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
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "settings",
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          theme: {
            type: DataTypes.ENUM("light", "dark"),
            allowNull: false,
            defaultValue: "dark",
          },
          banner: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          notifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "createTable",
      params: [
        "types",
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          typeName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
        },
        {
          transaction: transaction,
        },
      ],
    },
  ];
};

var rollbackCommands = function (transaction) {
  return [
    {
      fn: "dropTable",
      params: [
        "users",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "bookings",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "boxes",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "items",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "lockers",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "notifications",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "reports",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "reportlog",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "settings",
        {
          transaction: transaction,
        },
      ],
    },
    {
      fn: "dropTable",
      params: [
        "types",
        {
          transaction: transaction,
        },
      ],
    },
  ];
};

module.exports = {
  pos: 0,
  useTransaction: true,
  execute: function (queryInterface, Sequelize, _commands) {
    var index = this.pos;
    function run(transaction) {
      const commands = _commands(transaction);
      return new Promise(function (resolve, reject) {
        function next() {
          if (index < commands.length) {
            let command = commands[index];
            console.log("[#" + index + "] execute: " + command.fn);
            index++;
            queryInterface[command.fn]
              .apply(queryInterface, command.params)
              .then(next, reject);
          } else resolve();
        }
        next();
      });
    }
    if (this.useTransaction) {
      return queryInterface.sequelize.transaction(run);
    } else {
      return run(null);
    }
  },
  up: function (queryInterface, Sequelize) {
    return this.execute(queryInterface, Sequelize, migrationCommands);
  },
  down: function (queryInterface, Sequelize) {
    return this.execute(queryInterface, Sequelize, rollbackCommands);
  },
  info: info,
};
