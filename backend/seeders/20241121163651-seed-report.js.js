"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Reports", [
      {
        content:
          "Hola me gustaría reportar una incidencia sobre un ordenador roto es el número de serie 1234567X",
        isSolved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content:
          "Hola esto es una incidencia sobre una grimpadora en malfuncionamiento",
        isSolved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reports", null, {});
  },
};
