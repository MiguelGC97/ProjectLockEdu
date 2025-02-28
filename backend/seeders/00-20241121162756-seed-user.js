"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash("test1234", 10);
    const hashedPassword2 = await bcrypt.hash("mysecretpassword", 10);

    await queryInterface.bulkInsert("users", [
      {
        name: "Yamiley",
        surname: "Henríquez",
        username: "yamihg@gmail.com",
        password: hashedPassword1,
        avatar: null,
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah",
        surname: "Soares",
        username: "saraS@gmail.com",
        password: hashedPassword1,
        avatar: null,
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Miguel",
        surname: "Gutiérrez",
        username: "miguelgc@gmail.com",
        password: hashedPassword1,
        avatar: null,
        role: "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pepito",
        surname: "Pérez",
        username: "pepiperez@gmail.com",
        password: hashedPassword1,
        avatar: null,
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ana",
        surname: "Calima",
        username: "anacalima@gmail.com",
        password: hashedPassword1,
        avatar: null,
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};



