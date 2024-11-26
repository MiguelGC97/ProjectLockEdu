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

exports.getAll = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
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

    const state = req.params.state;

    const [updated] = await Booking.update(state, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Booking state changed",
        data: req.body,
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
