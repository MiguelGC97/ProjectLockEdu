module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "types",
      [
        {
          typeName: "Otros/No definido",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { typeName: "Portátiles", createdAt: new Date(), updatedAt: new Date() },
        {
          typeName: "Periféricos",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { typeName: "Cables", createdAt: new Date(), updatedAt: new Date() },
        {
          typeName: "Herramientas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeName: "Pantallas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeName: "Almacenamiento",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeName: "Redes y Internet",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeName: "Papelería",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeName: "Energía",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeName: "Mobiliario",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("types", null, {});
  },
};
