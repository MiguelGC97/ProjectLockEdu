const db = require("../models");
const Locker = db.locker;
const Report = db.report;
const Box = db.box;
const ReportLog = db.reportLog;
const User = db.user; 


exports.create = (req, res) => {
  return res.render("reportlog/create", { activeRoute: "reportlog"});
};

exports.store = async (req, res) => {
  const { comment, reportId } = req.body;
  const userId = req.user.id; // Obtener el userId de la sesión

  if (!comment || !reportId) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const newReportLog = await ReportLog.create({
      comment,   
      reportId,
      userId: req.user.id
    });

    res.status(201).json({ data: newReportLog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




exports.index = (req, res) => {
 
  findAll(req, res);
};


const findAll = (req, res) => {
  ReportLog.findAll({
    include: [
      {
        model: Report,
        attributes: ["id","isSolved"],
        include: [
          {
            model: Box,
            attributes: ["id","description"],
            include: [
              {
                model: Locker,
                attributes: ["id","description", "location"],
              },
            ],
          },
        ],
      },
      {
        model: User, 
        attributes: ["id", "name", "avatar"],
      },
    ],
  })
    .then((data) => {

      console.log(data);

      res.render("reportlog/index", {
        reportLog: data,
        activeRoute: "reportlog",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};


exports.edit = (req, res) => {
  const id = req.params.id;

  ReportLog.findByPk(id)
    .then((data) => {
      res.render("reportlog/edit", { data: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving reportLog with id=" + id,
      });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;

  ReportLog
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "reportLog was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update reportLog with id=${id}. Maybe reportLog was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating reportLog with id=" + id,
      });
    });
};

