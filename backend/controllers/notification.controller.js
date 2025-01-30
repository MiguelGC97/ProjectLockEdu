const db = require("../models");
const Notification = db.notification;

exports.addNotification = async (req, res) => {
  try {
    const notifications = await Notification.create(req.body);

    res.status(201).json({ data: notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json({ data: notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const notifications = await Notification.findByPk(id);

    if (!notifications) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ data: notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Notification.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Notification updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const deleting = await Notification.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Notification deleted" : "Notification not found";
  res.status(status).json({ message });
};
