
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('notifications', [
      { userId: 1, bookingId: 1, content: 'Nueva reserva en', isRead: false, type: 'info', createdAt: new Date(), updatedAt: new Date() },
      { userId: 1, bookingId: 1, content: 'Tiene una recogida próxima', isRead: false, type: 'reminder', createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, bookingId: 2, content: 'Tiene una devolución próxima', isRead: false, type: 'reminder', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
