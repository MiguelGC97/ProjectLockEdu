const db = require("../models");
const Locker = db.locker;
const { Op } = require('sequelize');


exports.addLockerDeprecated = async (req, res) => {
  try {
    const locker = await Locker.create(req.body);
    res.status(201).json({ data: locker });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addLocker = async (req, res) => {
  try {
    const { description, location, number } = req.body;

    if (!description || !location) {
      return res.status(400).send({ message: "Todos los campos son obligatorios!" });
    }

    const existingNumber = await Locker.findOne({ where: { number } });
    if (existingNumber) {
      return res.status(409).send({ message: "Ya existe un armario con este numero." });
    }


    const newLocker = await Locker.create({
      description,
      location,
      number
    });


    return res.status(201).json({
      locker: newLocker,
      message: "¡Armario creado con éxito!"
    });

  } catch (err) {
    return res.status(500).send({ message: err.message || "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const lockers = await Locker.findAll();
    res.status(200).json({ data: lockers });
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

exports.updateDeprecated = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Locker.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "¡Armario actualizado con éxito!",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Armario no encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.update = async (req, res) => {
  try {
    const { number, description, location } = req.body;
    const id = req.params.id;




    const existingLocker = await Locker.findOne({
      where: { number: number }
    });

    if (!number || !description || !location) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (existingLocker) {
      return res.status(409).json({ message: 'Ya existe un armario con este numero.' });
    }

    const [updated] = await Locker.update(
      { number, description, location },
      { where: { id } }
    );

    if (updated) {
      const updatedLocker = await Locker.findByPk(id);
      return res.status(200).json({
        message: '¡Armario actualizado con éxito!',
        data: updatedLocker,
      });
    } else {
      return res.status(404).json({ message: 'Armario no encontrado.' });
    }
  } catch (error) {
    console.error('Error during update:', error);

    res.status(500).json({
      message: "Ocurrió un error al actualizar el armario",
      error: error.message || 'Internal server error'
    });
  }
};




exports.delete = async (req, res) => {
  const deleting = await Locker.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Armario borrado" : "Armario no fue encontrado";
  return res.status(status).json({ message: message });
};
