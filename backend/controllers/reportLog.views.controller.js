const db = require("../models");
const Locker = db.locker;
const Report = db.report;
const Box = db.box;
const ReportLog = db.reportLog;

exports.store = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).json({ message: "Comment is required" });
  }

  try {
    const newReportLog = await ReportLog.create({
      comment: req.body.comment, // manager comment
      userId: req.user.id, // manager
      reportId: req.body.reportId, // report
    });

    res.status(201).json({ data: newReportLog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.index = (req, res) => {
  console.log("INDEX........................");
  findAll(req, res);
};
const findAll = (req, res) => {
  ReportLog.findAll({
    include: [
      {
        model: Report,
        attributes: ["boxId", "isSolved"],
        include: [
          {
            model: Box,
            attributes: ["description"],
            include: [
              {
                model: Locker,
                attributes: ["description", "location"],
              },
            ],
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.render("reportLog/index", {
        reportLog: data,
        activeRoute: "reportlog",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.create = (req, res) => {
  return res.render("reportlog/create");
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
