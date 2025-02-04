const db = require("../models");
const Settings = db.settings;

exports.addSettings = async (req, res) => {
  try {
    const settings = await Settings.create(req.body);

    res.status(201).json({ data: settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const settings = await Type.findAll();
    res.status(200).json({ data: settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const settings = await Settings.findByPk(id);

    if (!settings) {
      return res.status(404).json({ error: "Settings not found" });
    }

    res.status(200).json({ data: settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Settings.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Settings updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Settings not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const deleting = await Settings.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Settings deleted" : "Settings not found";
  res.status(status).json({ message });
};
