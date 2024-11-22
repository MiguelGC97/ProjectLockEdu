
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('types', [
      { id: 1, typeName: 'Portátil', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, typeName: 'Periférico', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, typeName: 'Cable', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, typeName: 'Herramienta', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('types', null, {});
  }
};
