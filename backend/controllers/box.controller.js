const db = require("../models");
const Box = db.box;
const fs = require('fs');
const path = require('path');

exports.addBoxDeprecated = async (req, res) => {
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

exports.addBoxDeprecated2 = async (req, res) => {
  try {
    const { lockerId, description } = req.body;

    if (!lockerId || !description) {
      return res.status(400).json({ message: "ID del armario y descripción son obligatorios." });
    }

    const boxData = {
      lockerId: lockerId,
      description: description,
      filename: req.file ? req.file.filename : null,
    };


    const createdBox = await Box.create(boxData);

    return res.status(201).json({
      box: createdBox,
      message: "¡Casilla creada con éxito!",
    });

  } catch (error) {
    console.error("Error creating box:", error);
    return res.status(500).send({ message: error.message || "Internal server error" });
  }
};



exports.addBox = async (req, res) => {
  try {
    const { description, lockerId, filename } = req.body;


    if (!description || !lockerId) {
      return res.status(400).json({ message: 'Falta campos obligatorios.' });
    }


    const newBox = await Box.create({
      description,
      filename,
      lockerId,
    });

    // Return the success response with the newly created box data
    return res.status(201).json({
      message: 'Box created successfully!',
      box: newBox
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while creating box.' });
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
    const boxes = await Box.findAll({ where: { lockerId: id } });
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
        message: "Casilla actualizada con éxito.",
        box: updated
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
