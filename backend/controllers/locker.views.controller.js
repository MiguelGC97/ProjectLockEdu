const db = require("../models");
const Locker = db.locker;
const WebSocket = require('ws');


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

        const wss = req.app.get('wss');
        if (wss) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'locker_create',
                        message: `Nuevo armario "${createdLocker.description}" creado en ${createdLocker.location}.`,
                        data: createdLocker
                    }));
                }
            });
        }

        return res.redirect("locker");
    } catch (error) {
        return res.status(500).json({ message: "Error creando el casillero.", error: error.message });
    }
};



exports.index = (req, res) => {
    findAll(req, res);
};

const findAll = (req, res) => {
    Locker.findAll().then((data) => {

        return res.render("locker/index", { lockers: data, activeRoute: "lockers" });
    });
};

exports.create = (req, res) => {
    Locker.findAll().then((data) => {

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
        const updatedLocker = await Locker.findByPk(id);

        const [updated] = await Locker.update(req.body, {
            where: { id: id },
        });

        const wss = req.app.get('wss');

        if (wss) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'locker_update',
                        message: `${updatedLocker.description} modificado.`,
                        data: updated
                    }));
                }
            });
        }

        if (updated === 1) {
            res.redirect("/locker");

        } else {
            res.send({
                message: `Cannot update locker with id=${id}. Maybe the locker was not found or the request body is empty!`,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error modificando el armario.", error: error.message });
    }
};

exports.destroy = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedLocker = await Locker.findByPk(id);

        if (!deletedLocker) {
            return res.status(404).send({
                message: `Locker with id=${id} not found.`,
            });
        }

        const num = await Locker.destroy({
            where: { id: id },
        });

        const wss = req.app.get('wss');

        if (wss) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'locker_delete',
                        message: `${deletedLocker.description} fue borrado.`,
                        data: deletedLocker
                    }));
                }
            });
        }

        if (num === 1) {
            return res.redirect("/locker");
        } else {
            return res.status(404).send({
                message: `Cannot delete locker with id=${id}. Maybe locker was not found!`,
            });
        }
    } catch (error) {
        console.error("Error deleting locker:", error);
        return res.status(500).send({
            message: "Could not delete locker with id=" + id,
        });
    }
};