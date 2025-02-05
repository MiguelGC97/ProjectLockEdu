
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('settings', [
      { id: 1, theme: 'Dark', banner : 'test', notifications: true, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('settings', null, {});
  }
};
