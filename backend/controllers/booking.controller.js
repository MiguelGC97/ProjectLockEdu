const db = require("../models");
const Booking = db.booking;
const Item = db.item;
const Box = db.box;
const Locker = db.locker;
const User = db.user;
const { Op, where } = require("sequelize");

exports.newBooking = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { description, checkOut, checkIn, state, itemIds, } = req.body;

    const userId = req.user.id;

    const missingFields = [];

    if (!userId) missingFields.push("userId");
    if (!checkOut) missingFields.push("checkOut");
    if (!checkIn) missingFields.push("checkIn");
    if (!state) missingFields.push("state");
    if (itemIds.length === 0) missingFields.push("itemIds");
    if (!Array.isArray(itemIds)) {
      return res.status(400).json({ message: "itemIds must be an array" });
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required booking data: ${missingFields.join(", ")}`,
      });
    }

    const booking = await Booking.create(
      { userId, description, checkOut, checkIn, state },
      { transaction: t }
    );

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

    await booking.addItem(availableItems, { transaction: t });

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

    await t.commit();

    res
      .status(201)
      .json({ message: "Booking created successfully", data: booking });
  } catch (error) {
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

exports.getDates = async (req, res) => {
  try {
    const { itemIds } = req.body; // Receives an array of Item ids

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ message: "itemIds can't be an empty array" });
    }

    const today = new Date();

    const bookings = await Booking.findAll({
      include: [
        {
          model: Item,
          where: { id: { [Op.in]: itemIds } },
          attributes: ['id'],
        },
        {
          model: User,
          attributes: ['name', 'surname']
        },
      ],
      attributes: ['checkIn', 'checkOut', 'state'],
    });

    if (bookings.length === 0) {
      return res.status(200).json({});
    }

    const itemDates = bookings.flatMap(booking =>
      booking.items
        .filter(item => new Date(booking.checkIn) >= today) // Filter out past check-ins
        .filter(item => booking.state != "returned")
        .map(item => ({
          itemId: item.id,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          state: booking.state,
        }))
    );

    res.status(200).json({ itemDates });
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
