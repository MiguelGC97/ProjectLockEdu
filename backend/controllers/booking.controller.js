const db = require("../models");
const Booking = db.booking;
const Item = db.item;
const Box = db.box;
const Locker = db.locker;
const { Op } = require("sequelize");

exports.newBooking = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    let { description, checkOut, checkIn, state, itemIds, userId } = req.body;

    // Ensure userId is an integer
    userId = parseInt(userId, 10);

    // Validate required fields
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!checkOut) missingFields.push("checkOut");
    if (!checkIn) missingFields.push("checkIn");
    if (!state) missingFields.push("state");
    if (!itemIds || itemIds.length === 0) missingFields.push("itemIds");

    // Validate itemIds is an array of integers
    if (!Array.isArray(itemIds)) {
      return res.status(400).json({ message: "itemIds must be an array" });
    }
    if (itemIds.some(id => !Number.isInteger(id))) {
      return res.status(400).json({ message: "itemIds must contain only integers" });
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required booking data: ${missingFields.join(", ")}`,
      });
    }

    // Validate dates (checkIn should be before checkOut)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "checkIn date must be before checkOut date" });
    }

    // Create the booking
    const booking = await Booking.create(
      { userId, description, checkOut, checkIn, state },
      { transaction: t }
    );

    // Get available items
    const availableItems = await Item.findAll({
      where: {
        id: {
          [Op.in]: itemIds,
        },
        state: "available",
      },
    });

    if (availableItems.length === 0) {
      await t.rollback();
      return res.status(404).json({
        message: "No available items found for the provided IDs",
      });
    }

    // Associate the booking with available items
    await booking.addItem(availableItems, { transaction: t });

    // Update item states to 'booked'
    await Item.update(
      { state: "booked" },
      {
        where: {
          id: {
            [Op.in]: itemIds,
          },
        },
        transaction: t,
      }
    );

    // Commit the transaction
    await t.commit();

    // Return success response
    res.status(201).json({ message: "Booking created successfully", data: booking });
  } catch (error) {
    console.error(error); // Log the full error stack trace
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllbyUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const bookings = await Booking.findAll({
      where: { userId: id },
      include: [
        {
          model: Item,
          include: [
            {
              model: Box,
              include: [
                {
                  model: Locker,
                  attributes: ['id', 'description'],
                },
              ],
              attributes: ['id', 'description'],
            },
          ],
          attributes: ['id', 'state', 'description'],
        },
      ],
    });
    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllbyUserIdAndState = async (req, res) => {
  try {
    const userId = req.params.userId;
    const state = req.params.state;

    const bookings = await Booking.findAll({
      where: { userId: userId, state: state },
      include: [
        {
          model: Item,
          include: [
            {
              model: Box,
              include: [
                {
                  model: Locker,
                  attributes: ['id', 'description'],
                },
              ],
              attributes: ['id', 'description'],
            },
          ],
          attributes: ['id',],
        },
      ],
    });

    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const bookings = await Booking.findByPk(id);

    if (!bookings) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Booking.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Booking updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeState = async (req, res) => {
  try {
    const id = req.params.id;

    const { state } = req.body;

    if (!state) {
      return res.status(400).json({ message: "State is required" });
    }

    const [updated] = await Booking.update({ state }, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Booking state changed",
        data: { id, state },
      });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const bookingId = req.params.id;

    // Finds items associated with booking
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Item }],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Changes items state
    const itemIds = booking.items.map(item => item.id);
    await Item.update(
      { state: "available" },
      {
        where: { id: { [Op.in]: itemIds } },
        transaction: t,
      }
    );

    await Booking.destroy({ where: { id: bookingId }, transaction: t });

    await t.commit();
    res.status(200).json({ message: "Booking deleted and items updated to available" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};
