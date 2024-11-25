"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash("password123", 10);
    const hashedPassword2 = await bcrypt.hash("mysecretpassword", 10);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Yamiley",
          surname: "Henríquez",
          username: "yamihg@gmail.com",
          password: hashedPassword1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sarah",
          surname: "Soares",
          username: "saraS@gmail.com",
          password: hashedPassword2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
