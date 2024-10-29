const db = require("../models");
const Locker = db.locker;

exports.create = (req, res) => {

    console.log(req.body);

    const locker = {
        : req.body.content,
        color: req.body.color
};

console.log('Note:', note);

Notebook.create(note).then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({ message: err.message || "Some error occurred while creating the notebook." });
});
};


exports.findAll = (req, res) => {

    const c = req.params.color;

    Notebook.findAll().then((data) => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving all notes." });
    });

};



exports.findAllQuery = (req, res) => {

    const q = req.params.query;
    Notebook.findAll({
        where: {
            content: { [Op.ilike]: '%' + q + '%' },
        },
    }).then((data) => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving notes with this text." });
    });

};


exports.update = (req, res) => {

    console.log("Body is:" + req.body);

    const id = req.params.id;
    const content = req.body.content;
    const color = req.body.color;


    Notebook.update({ content, color }, { where: { id: id } }).then(() => {
        res.send(newData);
        console.log("Data updated");
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while updating note." });
    });

};


exports.delete = (req, res) => {

    const id = req.params.id;
    Notebook.destroy({ where: { id: id } }).then(() => {
        console.log("Entry erased");
        res.send({ message: "Erased." });
    })



};


