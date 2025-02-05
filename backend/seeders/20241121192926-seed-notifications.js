
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('notifications', [
      { userId: 1, bookingId: 1, content: 'Nueva reserva', isRead: false, type: 'info', createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, bookingId: 2, content: 'Tiene una recogida próxima', isRead: false, type: 'reminder', createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, bookingId: 3, content: 'Tiene una devolución retrasada', isRead: false, type: 'warning', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
