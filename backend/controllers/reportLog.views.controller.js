const db = require("../models");
const Locker = db.locker;
const Report = db.report;
const Box = db.box;
const ReportLog = db.reportLog;
const User = db.user;

const reportLogAssociationData = [
  {
    model: Report,
    as: "report",
    attributes: ["id", "isSolved"],
    include: [
      {
        model: Box,
        as: "box",
        attributes: ["id", "description"],
        include: [
          {
            model: Locker,
            as: "locker",
            attributes: ["id", "description", "location"],
          },
        ],
      },
    ],
  },
  {
    model: User,
    as: "user",
    attributes: ["id", "name", "avatar", "role"],
  },
];

exports.create = (req, res) => {
  ReportLog.findAll({ include: reportLogAssociationData }).then((data) => {

    return res.render("reportlog/create", {
      reportLog: data,
      activeRoute: "reportlog",
    });
  });
};

exports.store = async (req, res) => {
  if (!req.body.reportId) {
    return res.status(400).json({ message: "Campo de Id vacio." });
  }
  if (!req.body.comment) {
    return res.status(400).json({ message: "Campo de comentario vacio." });
  }

  const newComment = {
    comment: req.body.comment,
    reportId: req.body.reportId,
    userId: req.session.user.id,
  };

  try {
    const postComment = await ReportLog.create(newComment);
    return res.redirect("/reportlog");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error posting your comment.", error: error.message });
  }
};

exports.index = (req, res) => {
  findAll(req, res);
};

const findAll = (req, res) => {
  ReportLog.findAll({
    include: reportLogAssociationData,
    order: [[db.Sequelize.col("Report.id"), "ASC"]],
  })
    .then((data) => {


      return res.render("reportlog/index", {
        reportLog: data,
        activeRoute: "reportlog",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.edit = async (req, res) => {
  const id = req.params.id;

  try {
    const currentLog = await ReportLog.findByPk(id);

    if (!currentLog) {
      return res.status(404).send({
        message: `log with id ${id} not found`,
      });
    }

    const reportLog = await ReportLog.findAll({
      include: reportLogAssociationData
    });

    res.render("reportlog/edit", {
      currentLog,
      activeRoute: "reportlog",
      reportLog,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving log with id=" + id,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await ReportLog.update(req.body, {
      where: { id: id },
    });

    if (updated === 1) {
      res.redirect("/reportlog");

    } else {
      res.send({
        message: `Cannot update log with id=${id}.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating log with id=" + id,
    });
  }
};

exports.destroy = async (req, res) => {
  const id = req.params.id;
  const sessionUserId = req.session.user && req.session.user.id;

  if (!sessionUserId) {
    return res.status(401).send({ message: "No estás autenticado." });
  }

  try {

    const reportLog = await ReportLog.findOne({ where: { id: id } });
    if (!reportLog) {
      return res
        .status(404)
        .send({ message: `No se encontró el log con id=${id}.` });
    }


    if (reportLog.userId !== sessionUserId) {
      return res
        .status(403)
        .send({ message: "No estás autorizado para borrar este log." });
    }


    const num = await ReportLog.destroy({ where: { id: id } });
    if (num === 1) {
      return res.redirect("/reportlog");
    } else {
      return res.send({ message: `No se pudo borrar el log con id=${id}.` });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error al borrar el log con id=" + id,
      error: error.message,
    });
  }
};
