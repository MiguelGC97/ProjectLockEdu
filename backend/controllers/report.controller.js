const { format } = require("sequelize/lib/utils");
const db = require("../models");
const Report = db.report;
const User = db.user;
const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op, AccessDeniedError } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const reports = await Report.findAll({


      include: [
        {
          model: db.user,
          attributes: ['name', 'avatar'],
        },
      ],
    });
    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getReportByUsername = async (req, res) => {
  try {
    const { username } = req.params;


    const user = await User.findOne({
      where: { username: { [Op.like]: `%${username}%` } },
      include: [
        {
          model: Report,
          as: "reports",
          attributes: ["id", "content", "isSolved"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      reports: user.reports,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReportByUserId = async (req, res) => {
  try {
    const { userId } = req.params;


    const user = await User.findByPk(userId, {
      include: [
        {
          model: Report,
          as: "reports",
          attributes: ["id", "content", "isSolved", "boxId", "userId", "createdAt"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" + userId });
    }

    res.status(200).json({
      username: user.username,
      reports: user.reports,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Report.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).send({
        message: `Report with id = ${id} not found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Error retrieving Report with id= ${id}`,
      error: error.message,
    });
  }
};

exports.createReport = async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    let report = {
      content: req.body.content,
      isSolved: req.body.isSolved ?? false,
      userId: req.body.userId,
      boxId: req.body.boxId,
    };

    const newReport = await Report.create(report);


    const token = utils.generateTokenReport(newReport);
    const reportObj = utils.getCleanReport(newReport);
    return res.json({ report: reportObj, access_token: token });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the report.",
    });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const id = req.params.id;

    const { isSolved } = req.body;

    if (!isSolved) {
      return res.status(400).json({ message: "isSolved is required" });
    }

    const [updated] = await Report.update({ isSolved }, { where: { id } });

    if (updated) {
      res.status(200).json({
        isSolved: true,
      });
    } else {
      res.status(404).json({ message: "report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateDescription = async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;
  const userId = req.user.id;

  try {

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }


    if (report.userId !== userId) {
      return res.status(403).json({ message: "You are not allowed to update this report" });
    }


    report.content = content;
    await report.save();

    return res.status(200).json({
      message: "Incidence content updated",
      data: { content },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;


  try {
    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.destroy();

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

