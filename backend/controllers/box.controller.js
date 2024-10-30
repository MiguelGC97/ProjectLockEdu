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


exports.findAllQuery = (req, res) => {

    

};


exports.update = (req, res) => {

    

};


exports.delete = (req, res) => {

    
};