const { where } = require("sequelize");
const db = require("../models");
const Booking = db.booking;
const Item = db.item;

exports.addBooking = async (req, res) => {
  try {
    const bookings = await Booking.create(req.body);

    res.status(201).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.newBooking = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { description, checkOut, checkIn, state, itemIds } = req.body;

    const userId = req.user.id;

    if (!userId || !checkOut || !checkIn || !state || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ message: "Missing required booking data"});
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({ message: "Check-in must be earlier than check-out" });
    }

    const booking = await Booking.create(
      { userId, description, checkOut, checkIn, state },
      { transaction: t }
    );

    const items = await Item.getAllAvailable(itemIds);
    await booking.addItem(items, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Booking created successfully", data: booking });
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
    const bookings = await Booking.findAll({ where:{ userId:id } });
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

exports.addItemToBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const itemId = req.body.itemId;

    const bookings = await Booking.findByPk(id);

    if (!bookings) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const items = await Item.findByPk(itemId);
    if (!items) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await bookings.addItem(items);

    res.status(200).json({ message: 'Item added to booking successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const deleting = await Booking.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Booking deleted" : "Booking not found";
  res.status(status).json({ message });
};
