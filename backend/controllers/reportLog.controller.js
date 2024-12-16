
const db = require("../models");
const ReportLog = db.reportsLog;
const User = db.user;
const bcrypt = require("bcryptjs");


exports.getAll = async (req, res) => {
  try {
    const reports = await Report.findAll({});
    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReportByReportManagerId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: ReportLog,
          as: "reports",
          attributes: [
            "id",
            "content",
            "isSolved",
            "boxId",
            "userId",
            "createdAt",
          ],
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
        message: `log with id = ${id} not found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Error retrieving log with id= ${id}`,
      error: error.message,
    });
  }
};

exports.createComment = async (req, res) => {
    try {
        const comment = await .create(req.body);
        res.status(201).json({ data: items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateDescription = async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;

  try {
    const [updated] = await Report.update(
      { content },
      {
        where: { id },
      }
    );

    if (updated) {
      res.status(200).json({
        message: "Incidence content updated",
        data: { content },
      });
    } else {
      res.status(404).json({ message: "Incidence not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
