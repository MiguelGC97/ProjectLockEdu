
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('items', [
      { id: 1, typeId: 1, boxId: 1, description: 'Portátil Asus de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, typeId: 1, boxId: 1, description: 'Portátil Msi de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, typeId: 1, boxId: 1, description: 'Portátil Acer de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, typeId: 2, boxId: 1, description: 'Ratón de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, typeId: 2, boxId: 1, description: 'Teclado de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, typeId: 3, boxId: 1, description: 'Cable de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, typeId: 3, boxId: 1, description: 'Cable de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, typeId: 3, boxId: 1, description: 'Cable de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, typeId: 4, boxId: 1, description: 'Crimpadora de casilla 1', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, typeId: 4, boxId: 1, description: 'Tijera de casilla 1', state: 'retrieved', createdAt: new Date(), updatedAt: new Date() },

      { id: 11, typeId: 1, boxId: 2, description: 'Portátil Asus de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 12, typeId: 1, boxId: 2, description: 'Portátil Msi de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 13, typeId: 1, boxId: 2, description: 'Portátil Acer de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 14, typeId: 2, boxId: 2, description: 'Ratón de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 15, typeId: 2, boxId: 2, description: 'Teclado de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 16, typeId: 3, boxId: 2, description: 'Cable de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 17, typeId: 3, boxId: 2, description: 'Cable de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 18, typeId: 3, boxId: 2, description: 'Cable de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 19, typeId: 4, boxId: 2, description: 'Crimpadora de casilla 2', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 20, typeId: 4, boxId: 2, description: 'Tijera de casilla 2', state: 'retrieved', createdAt: new Date(), updatedAt: new Date() },

      { id: 21, typeId: 1, boxId: 11, description: 'Portátil Asus de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 22, typeId: 1, boxId: 11, description: 'Portátil Msi de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 23, typeId: 1, boxId: 11, description: 'Portátil Acer de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 24, typeId: 2, boxId: 11, description: 'Ratón de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 25, typeId: 2, boxId: 11, description: 'Teclado de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 26, typeId: 3, boxId: 11, description: 'Cable de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 27, typeId: 3, boxId: 11, description: 'Cable de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 28, typeId: 3, boxId: 11, description: 'Cable de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 29, typeId: 4, boxId: 11, description: 'Crimpadora de casilla 11', state: 'returned', createdAt: new Date(), updatedAt: new Date() },
      { id: 30, typeId: 4, boxId: 11, description: 'Tijera de casilla 11', state: 'retrieved', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('items', null, {});
  }
};