
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('types', [
      { typeName: 'Portátil', createdAt: new Date(), updatedAt: new Date() },
      { typeName: 'Periférico', createdAt: new Date(), updatedAt: new Date() },
      { typeName: 'Cable', createdAt: new Date(), updatedAt: new Date() },
      { typeName: 'Herramienta', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('types', null, {});
  }
};
