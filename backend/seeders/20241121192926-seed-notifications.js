
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('notifications', [
      { userId: '1', bookingId: 1, content: 'Ha hecho una nueva reserva', isRead: false, type: 'info', createdAt: new Date(), updatedAt: new Date() },
      { userId: '1', bookingId: 1, content: 'Tiene una recogida próxima en 15 minutos', isRead: false, type: 'reminder', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
