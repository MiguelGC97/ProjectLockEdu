module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "boxes",
      [
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 1,
          description: "Casilla del armario 01",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          lockerId: 2,
          description: "Casilla del armario 02",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 2,
          description: "Casilla del armario 02",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 2,
          description: "Casilla del armario 02",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 2,
          description: "Casilla del armario 02",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 2,
          description: "Casilla del armario 02",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lockerId: 2,
          description: "Casilla del armario 02",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          lockerId: 3,
          description: "Casilla del armario 03",
          filename: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("boxes", null, {});
  },
};
