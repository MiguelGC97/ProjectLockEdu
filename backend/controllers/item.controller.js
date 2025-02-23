const db = require("../models");
const Item = db.item;

exports.addItemDeprecated = async (req, res) => {
    try {
        const items = await Item.create(req.body);
        res.status(201).json({ data: items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.addItem = async (req, res) => {
    try {
        const { typeId, boxId, description } = req.body;

        if (!boxId || !typeId || !description) {
            return res.status(400).send({ message: "Todos los campos son obligatorios!" });
        }


        const newItem = await Item.create({
            typeId, boxId, description
        });


        return res.status(201).json({
            item: newItem,
            message: "¡Objeto creado con éxito!"
        });

    } catch (err) {
        return res.status(500).send({ message: err.message || "Internal server error" });
    }
};

exports.getAll = async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json({ data: items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { typeId, boxId, description } = req.body;
        const { id } = req.params;


        const [updated] = await Item.update(
            { typeId, boxId, description },
            { where: { id } }
        );

        if (updated) {
            const updatedItem = await Item.findByPk(id);
            return res.status(200).json({
                message: '¡Objeto actualizado con éxito!',
                data: updatedItem,
            });
        } else {
            return res.status(404).json({ message: 'Objeto no encontrado.' });
        }
    } catch (error) {
        console.error('Error during update:', error);

        res.status(500).json({
            message: "Ocurrió un error al actualizar el objeto",
            error: error.message || 'Internal server error'
        });
    }
};


exports.delete = async (req, res) => {
    const deleting = await Item.destroy({ where: { id: req.params.id } });
    const status = deleting ? 200 : 404;
    const message = deleting ? "Objeto borrado" : "Objeto no fue encontrado";
    return res.status(status).json({ message: message });
};
