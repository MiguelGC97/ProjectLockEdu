
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('boxes', [
      { id: 1, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 9, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 10, lockerId: 1, description: 'Casilla del armario 01', filename: null, createdAt: new Date(), updatedAt: new Date() },

      { id: 11, lockerId: 2, description: 'Casilla del armario 02', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 12, lockerId: 2, description: 'Casilla del armario 02', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 13, lockerId: 2, description: 'Casilla del armario 02', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 14, lockerId: 2, description: 'Casilla del armario 02', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 15, lockerId: 2, description: 'Casilla del armario 02', filename: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 16, lockerId: 2, description: 'Casilla del armario 02', filename: null, createdAt: new Date(), updatedAt: new Date() },

      { id: 17, lockerId: 3, description: 'Casilla del armario 03', filename: null, createdAt: new Date(), updatedAt: new Date() },

    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('boxes', null, {});
  }
};
