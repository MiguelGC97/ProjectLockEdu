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
        avatar: "https://sm.ign.com/ign_es/image/k/kabosu-the/kabosu-the-dog-behind-the-doge-meme-has-died_k7ec.jpg",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah",
        surname: "Soares",
        username: "saraS@gmail.com",
        password: hashedPassword1,
        avatar: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Miguel",
        surname: "Gutiérrez",
        username: "miguelgc@gmail.com",
        password: hashedPassword1,
        avatar: "https://cl2.buscafs.com/www.tomatazos.com/public/uploads/images/449861/449861.jpeg",
        role: "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "John",
        surname: "Doe",
        username: "john.doe@gmail.com",
        password: hashedPassword2,
        avatar: "imagen",
        role: "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane",
        surname: "Smith",
        username: "jane.smith@gmail.com",
        password: hashedPassword1,
        avatar: "imagen",
        role: "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};



