const db = require("../models");
const Locker = db.locker;

exports.store = async (req, res) => {
    if (!req.body.description) {
        return res.status(400).json({ message: "Se requiere la descripción del casillero." });
    } else if (!req.body.location) {
        return res.status(400).json({ message: "Se requiere la ubicación del casillero." });
    }

    const newLocker = {
        description: req.body.description,
        number: req.user.number,
        location: req.body.location,
    };

    Locker.create = async (req, res) => {
        try {
            const newLocker = await Locker.create(newLocker);
            res.status(201).json({ data: newLocker });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
};

exports.index = (req, res) => {
    findAll(req, res);
};

const findAll = (req, res) => {
    Locker.findAll().then((data) => {
        console.log(data);
        return res.render("locker/index", { lockers: data, activeRoute: "lockers" });
    });
};

exports.create = (req, res) => {
    return res.render("locker/create");
};

exports.edit = (req, res) => {
    const id = req.params.id;

    Locker.findByPk(id)
        .then((data) => {
            res.render("locker/edit", { locker: data });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving locker with id=" + id,
            });
        });
};

exports.update = async (req, res) => {
    const id = req.params.id;

    Locker
        .update(req.body, {
            where: { id: id },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "locker was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update locker with id=${id}. Maybe locker was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating locker with id=" + id,
            });
        });
};
