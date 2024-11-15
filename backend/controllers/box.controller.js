const db = require("../models");
const Box = db.box;

// exports.create = (req, res) => {

//     const box = {
//         id: req.body.id,
//         description: req.body.description,
//         imgUrl: req.body.color,
//     };

//     Box.create(box)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "An error ocurred while creating the box"
//             });
//         });
// };

exports.addBox = async (req, res) => {
    try {
        const boxes = await Box.create(req.body);
        res.status(201).json({ data: boxes })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    const id = req.params.id;

    if (!id) {
        return res.status(400).send({
            message: "Not a valid ID"
        });
    }
    
    Box.update(req.body, { where: {id: id}})
    .then(() => {
        console.log("Box updated");
        res.send({message: "Box updated"});
    })
};


exports.delete = (req, res) => {
    const id = req.params.id;

    Box.destroy({ where: { id: id}})
    .then(() => {
        console.log("Box erased");
        res.send({message: "Box erased"});
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error ocurred while deleting the box"
        });
    });
    
};