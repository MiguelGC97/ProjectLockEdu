module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "bookings",
      [
        {
          description: "Reserva 1",
          checkOut: "2024-12-10 14:00:00",
          checkIn: "2024-12-15 12:00:00",
          state: "pending",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Reserva 2",
          checkOut: "2025-2-6 19:00:00",
          checkIn: "2025-2-5 19:00:00",
          state: "withdrawn",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Reserva 3",
          checkOut: "2024-12-10 14:00:00",
          checkIn: "2024-12-15 12:00:00",
          state: "pending",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Reserva 4",
          checkOut: "2024-12-10 14:00:00",
          checkIn: "2024-12-15 12:00:00",
          state: "pending",
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "BookingItems",
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
          itemId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 2,
          itemId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 2,
          itemId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 3,
          itemId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 3,
          itemId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 3,
          itemId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 4,
          itemId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 4,
          itemId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookingId: 4,
          itemId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("BookingItems", null, {});

    await queryInterface.bulkDelete("bookings", null, {});
  },
};
