const db = require("../models");
const Locker = db.locker;


exports.store = async (req, res) => {
    if (!req.body.description) {
        return res.status(400).json({ message: "Se requiere la descripción del casillero." });
    }
    if (!req.body.location) {
        return res.status(400).json({ message: "Se requiere la ubicación del casillero." });
    }

    const newLocker = {
        description: req.body.description,
        location: req.body.location,
        number: req.user ? req.user.number : null,
    };

    try {
        const createdLocker = await Locker.create(newLocker);
        return res.redirect("locker");
    } catch (error) {
        return res.status(500).json({ message: "Error creating locker.", error: error.message });
    }
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
    Locker.findAll().then((data) => {
        console.log(data);
        return res.render("locker/create", { lockers: data, activeRoute: "lockers" });
    });
};

exports.edit = async (req, res) => {
    const id = req.params.id;

    try {
        const currentLocker = await Locker.findByPk(id);

        if (!currentLocker) {
            return res.status(404).send({
                message: `Locker with id ${id} not found`,
            });
        }


        const lockers = await Locker.findAll();


        res.render("locker/edit", {
            currentLocker,
            activeRoute: "lockers",
            lockers,
        });
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving locker with id=" + id,
        });
    }
};


exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        // Update the locker with the provided id using the request body
        const [updated] = await Locker.update(req.body, {
            where: { id: id },
        });

        // If no rows were affected, it means either the locker wasn't found or the update request was empty
        if (updated === 1) {
            res.redirect("/locker");
            console.log("Locker was updated successfully.", updated);
        } else {
            res.send({
                message: `Cannot update locker with id=${id}. Maybe the locker was not found or the request body is empty!`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating locker with id=" + id,
        });
    }
};


exports.destroy = (req, res) => {
    const id = req.params.id;

    try {
        Locker.destroy({
            where: { id: id },
        }).then((num) => {
            if (num == 1) {
                return res.redirect("/locker");
            } else {
                res.send({
                    message: `Cannot delete locker with id=${id}. Maybe locker was not found!`,
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            message: "Could not delete locker with id=" + id,
        });
    }

}