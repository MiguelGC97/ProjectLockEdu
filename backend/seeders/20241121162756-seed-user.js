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
        avatar: "imagen",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah",
        surname: "Soares",
        username: "saraS@gmail.com",
        password: hashedPassword2,
        avatar: "imagen",
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Miguel",
        surname: "Angel",
        username: "Manager@gmail.com",
        password: hashedPassword1,
        avatar: "imgen",
        role: "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};



