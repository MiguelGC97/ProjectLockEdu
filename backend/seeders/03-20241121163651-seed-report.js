"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("reports", [
      {
        content:
          "Hola me gustaría reportar una incidencia sobre un ordenador roto es el número de serie 1234567X",
        isSolved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 1,
        userId: 2,
      },
      {
        content:
          "Hola esto es una incidencia sobre una grimpadora en malfuncionamiento",
        isSolved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 2,
        userId: 2,
      },
      {
        content:
          "Hola, quiero reportar que el router en la oficina principal está fallando y no conecta correctamente.",
        isSolved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 3,
        userId: 2,
      },
      {
        content:
          "Buenos días, el proyector de la sala de juntas no enciende, parece que hay un problema con el cable de alimentación.",
        isSolved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 4,
        userId: 2,
      },
      {
        content:
          "Quiero reportar que hay un problema con el switch de red en el piso 2, algunos equipos no tienen acceso a internet.",
        isSolved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 5,
        userId: 2,
      },
      {
        content:
          "Hola, la impresora multifunción no responde y muestra un error de atascamiento constante, aunque no hay papel bloqueado.",
        isSolved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 6,
        userId: 1,
      },
      {
        content:
          "Buenas tardes, uno de los monitores en la zona de trabajo tiene la pantalla con líneas horizontales, parece defectuoso.",
        isSolved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 7,
        userId: 1,
      },
      {
        content:
          "Hola, el teclado inalámbrico que tenemos en recepción no funciona correctamente, las teclas se quedan trabadas.",
        isSolved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxId: 8,
        userId: 1,
      },

    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("reports", null, {});
  },
};
