const db = require("../models");
const Box = db.box;

exports.addBox = async (req, res) => {
  try {
    if (!req.body.locker_id) {
      return res.status(400).json({ error: "locker_id is required" });
    }

    const boxData = {
      locker_id: req.body.locker_id,
      description: req.body.description,
      filename: req.file ? req.file.filename : "",
    };

    const boxes = await Box.create(boxData);

    res.status(201).json({ data: boxes });
  } catch (error) {
    console.error("Error creating box:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const boxes = await Box.findAll();
    res.status(200).json({ data: boxes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const boxes = await Box.findByPk(id);

    if (!boxes) {
      return res.status(404).json({ error: "Box not found" });
    }

    res.status(200).json({ data: boxes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllbyLockerId = async (req, res) => {
  try {

    const id = req.params.id;
    const boxes = await Box.findAll({ where:{ lockerId:id } });
    res.status(200).json({ data: boxes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Box.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Box updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Box not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const deleting = await Box.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Box deleted" : "Box not found";
  res.status(status).json({ message });
};
