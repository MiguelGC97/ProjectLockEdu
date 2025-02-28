"use strict";

const { DataTypes } = require("sequelize");

var info = {
  revision: 1,
  name: "00",
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
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            field: "name",
            allowNull: false,
          },
          surname: {
            type: DataTypes.STRING,
            field: "surname",
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            field: "password",
            allowNull: false,
          },
          username: {
            field: "username",
            type: DataTypes.STRING,
          },
          avatar: {
            field: "avatar",
            type: DataTypes.STRING,
          },
          role: {
            type: DataTypes.ENUM("TEACHER", "ADMIN", "MANAGER"),
            field: "role",
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
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
            field: "id",
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          description: DataTypes.STRING,
          checkOut: DataTypes.DATE,
          checkIn: DataTypes.DATE,
          state: {
            type: DataTypes.ENUM("pending", "withdrawn", "returned"),
            field: "state",
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
            field: "userId",
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
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
        "bookingItems",
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "bookings",
              key: "id",
            },
            onDelete: "CASCADE",
          },
          itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
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
            field: "id",
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          description: DataTypes.STRING,
          number: {
            type: DataTypes.INTEGER,
            field: "number",
            allowNull: true,
          },
          location: {
            type: DataTypes.STRING,
            field: "location",
            allowNull: true,
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
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
        "boxes",
        {
          id: {
            type: DataTypes.INTEGER,
            field: "id",
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
            allowNull: false,
          },

          lockerId: {
            type: DataTypes.INTEGER,
            field: "lockerId",
            allowNull: false,
            references: {
              model: "lockers",
              key: "id",
            },
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
        "types",
        {
          id: {
            type: DataTypes.INTEGER,
            field: "id",
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          typeName: {
            type: DataTypes.STRING,
            field: "typeName",
            allowNull: false,
            unique: true,
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
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
        "items",
        {
          id: {
            type: DataTypes.INTEGER,
            field: "id",
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          typeId: {
            type: DataTypes.INTEGER,
            field: "typeId",
            allowNull: false,
            field: "typeId",
            references: {
              model: "types",
              key: "id",
            },
          },
          boxId: {
            type: DataTypes.INTEGER,
            field: "boxId",
            allowNull: false,
            references: {
              model: "boxes",
              key: "id",
            },
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
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
        "notifications",
        {
          id: {
            type: DataTypes.INTEGER,
            field: "id",
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          userId: {
            type: DataTypes.INTEGER,
            field: "userId",
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          bookingId: {
            type: DataTypes.INTEGER,
            field: "bookingId",
            allowNull: false,
            references: {
              model: "bookings",
              key: "id",
            },
          },
          content: DataTypes.STRING,
          isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          },
          type: {
            type: DataTypes.ENUM("warning", "reminder", "info"),
            field: "type",
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
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
            field: "id",
            primaryKey: true,
            autoIncrement: true,
          },

          content: {
            type: DataTypes.STRING,
            field: "content",
            allowNull: false,
          },

          isSolved: {
            type: DataTypes.BOOLEAN,
            field: "isSolved",
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
            allowNull: false,
          },
          boxId: {
            type: DataTypes.INTEGER,
            field: "boxId",
            allowNull: false,
            references: {
              model: "boxes",
              key: "id",
            },
          },
          userId: {
            type: DataTypes.INTEGER,
            field: "userId",
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
        "reportLog",
        {
          id: {
            type: DataTypes.INTEGER,
            field: "id",
            autoIncrement: true,
            primaryKey: true,
          },
          comment: {
            type: DataTypes.STRING,
            field: "comment",
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
            allowNull: false,
          },
          reportId: {
            type: DataTypes.INTEGER,
            field: "reportId",
            allowNull: false,
            references: {
              model: "reports",
              key: "id",
            },
          },
          userId: {
            type: DataTypes.INTEGER,
            field: "userId",
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
        "settings",
        {
          id: {
            type: DataTypes.INTEGER,
            field: "id",
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          theme: {
            type: DataTypes.ENUM("light", "dark"),
            field: "theme",
            allowNull: false,
            defaultValue: "dark",
          },
          banner: {
            type: DataTypes.STRING,
            field: "banner",
            allowNull: false,
          },
          notifications: {
            type: DataTypes.BOOLEAN,
            field: "notifications",
            allowNull: false,
            defaultValue: true,
          },
          userId: {
            type: DataTypes.INTEGER,
            field: "userId",
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            field: "updatedAt",
            allowNull: false,
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
        "bookingItems",
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
        "boxes",
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
        "reportLog",
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
