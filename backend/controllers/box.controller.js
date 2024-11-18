const db = require("../models");
const Box = db.box;

exports.addBox = async (req, res) => {
  try {
    const boxes = await Box.create(req.body);
    res.status(201).json({ data: boxes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const boxes = await Box.findAll();
    res.status(200).json({ data: boxes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const boxes = await Box.findByPk(id);

    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }

    res.status(200).json({ data: boxes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Box.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Box updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "Box not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Box.destroy({ where: { id: id } })
//     .then(() => {
//       console.log("Box erased");
//       res.send({ message: "Box erased" });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error ocurred while deleting the box",
//       });
//     });
// };

exports.delete = async (req, res) => {
  const deleting = await Box.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Box deleted" : "Box not found";
  res.status(status).json({ message });
};
