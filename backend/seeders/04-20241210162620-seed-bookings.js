module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "bookings",
      [
        {
          description: "Reserva 1",
          checkOut: "2025-03-10 14:00:00",
          checkIn: "2025-03-15 12:00:00",
          state: "pending",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Reserva 2",
          checkOut: "2025-3-3 19:00:00",
          checkIn: "2025-3-6 19:00:00",
          state: "withdrawn",
          userId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Reserva 3",
          checkOut: "2025-02-27 14:00:00",
          checkIn: "2025-02-28 12:00:00",
          state: "returned",
          userId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "bookingItems",
      [
        {
          bookingId: 1,
          itemId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 1,
          itemId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 1,
          itemId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 2,
          itemId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 2,
          itemId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 3,
          itemId: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 3,
          itemId: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 3,
          itemId: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("bookingItems", null, {});

    await queryInterface.bulkDelete("bookings", null, {});
  },
};
