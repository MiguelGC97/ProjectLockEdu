const db = require("../models");
const Locker = db.locker;

exports.addLocker = async (req, res) => {
  try {
    const lockers = await Locker.create(req.body);
    res.status(201).json({ data: lockers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const lockers = await Locker.findAll();
    res.status(200).json(lockers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const lockers = await Locker.findByPk(id);

    if (!lockers) {
      return res.status(404).json({ error: "Locker not found" });
    }

    res.status(200).json({ data: lockers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Locker.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Locker updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Locker not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const deleting = await Locker.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Locker deleted" : "Locker not found";
  res.status(status).json({ message });
};


