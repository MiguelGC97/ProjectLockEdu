const db = require("../models");
const ReportLog = db.reportLog;

exports.storeReportLog = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).json({ message: "Comment is required" });
  }

  const reportLog = {
    comment: req.body.comment,
    userId: req.user.id,
    reportId: req.body.reportId,
  };

  ReportLog.create = async (req, res) => {
    try {
      const newReportLog = await ReportLog.create(reportLog);
      res.status(201).json({ data: newReportLog });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.index = (req, res) => {
    findAll(req, res);
  };

  const findAll = async (req, res) => {
    try {
      const reportLog = await ReportLog.findAll();
      res.status(200).json({ data: reportLog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.create = (req, res) => {
    return res.render("reportLog/create");

    //should create routes file in the backend folder to make it work
  };

  exports.edit = (req, res) => {
    const id = req.params.id;

    reportLog
      .findByPk(id)
      .then((data) => {
        res.render("reportLog/edit", { data: data });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving reportLog with id=" + id,
        });
      });
  };

  exports.update = async (req, res) => {
    const id = req.params.id;

    reportLog
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
};
