
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('lockers', [
      { id: 1, description: 'Armario 01', number: 1, location: 'Aula 101', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, description: 'Armario 02', number: 2, location: 'Aula 102', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, description: 'Armario 03', number: 3, location: 'Aula 103', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, description: 'Armario 04', number: 4, location: 'Aula 104', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('lockers', null, {});
  }
};