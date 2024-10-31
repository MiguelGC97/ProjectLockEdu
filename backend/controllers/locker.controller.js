const db = require("../models");
const Locker = db.locker;

exports.create = (req, res) => {

    console.log(req.body);

    const locker = {
        id: req.body.id,
        number: req.body.number,
        description: req.body.description,
        location: req.body.location

    };

    console.log('Locker:', locker);

    Locker.create(locker).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "An error occurred while creating the locker." });
    });
};


exports.findAll = (req, res) => {

    Locker.findAll().then((data) => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "An error occurred while retrieving all lockers." });
    });

};


exports.update = (req, res) => {

    const id = req.params.id;

    if (!id) {
        return res.status(400).send({
            message: "Not a valid ID"
        });
    }

    Locker.update(req.body, { where: { id: id } })
        .then(() => {
            console.log("Locker updated");
            res.send({ message: "Locker updated" });
        })

};


exports.delete = (req, res) => {

    const id = req.params.id;
    Locker.destroy({ where: { id: id } }).then(() => {
        console.log("Locker erased");
        res.send({ message: "Locker was erased." });
    })


};


