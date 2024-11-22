const db = require("../models");
const Item = db.item;

exports.addItem = async (req, res) => {
    try {
        const items = await Item.create(req.body);
        res.status(201).json({ data: items });
    } catch (error) {
        res.status(500).json({ error: error.message });
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




exports.delete = async (req, res) => {
    const deleting = await Item.destroy({ where: { id: req.params.id } });
    const status = deleting ? 200 : 404;
    const message = deleting ? "Item deleted" : "Item not found";
    res.status(status).json({ message });
};


