const db = require("../models");
const Type = db.type;

exports.addType = async (req, res) => {
  try {
    const types = await Type.create(req.body);

    res.status(201).json({ data: types });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const types = await Type.findAll();
    res.status(200).json({ data: types });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const types = await Type.findByPk(id);

    if (!types) {
      return res.status(404).json({ error: "Type not found" });
    }

    res.status(200).json({ data: types });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Type.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Type updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Type not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const deleting = await Type.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Type deleted" : "Type not found";
  res.status(status).json({ message });
};
