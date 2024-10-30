const db = require("../models");
const Box = db.box;

exports.create = (req, res) => {

    const box = {
        description: req.body.description,
        imgUrl: req.body.color,
    };

    Box.create(box)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error ocurred while creating the box"
            });
        });
};


exports.findAll = (req, res) => {
    Box.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error ocurred while retrieving the boxes"
            });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Box.findByPk(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Box not found." });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error ocurred while retrieving the box"
            });
        })
};

exports.findAllQuery = (req, res) => {

    

};


exports.update = (req, res) => {

    

};


exports.delete = (req, res) => {

    
};