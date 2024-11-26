const db = require("../models");
const Report = db.report;
const User = db.user;
const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op, AccessDeniedError } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getReportByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    // Buscar al usuario por username incluyendo los reportes relacionados
    const user = await User.findOne({
      where: { username: { [db.Op.like]: `%${username}%` } },
      include: [
        {
          model: Report,
          through: { attributes: [] }, // Evitar incluir datos de la tabla intermedia
        },
      ],
    });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json({ username: user.username, reports: user.reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findone = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Report.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Report with id = ${id} not found`,
      });
    }
  } catch {
    res.status(500).send({
      message: `Error retrieving Report with id= ${id}`,
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
      teacherId: req.body.teacherId,
    };

    const newReport = await Report.create(report);

    // Generate token and return data
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
    const [updated] = await Report.update((req.isSolved = true), {
      where: { id },
    });

    if (updated) {
      res.status(200).json({
        message: "Report resolved",
      });
    } else {
      res.status(404).json({
        message: "The report you are trying to update can't be found",
      });
    }
  } catch {
    err;
  }
  {
    res.status(500).json({ err: error.message });
  }
};

exports.updateDescription = async (req, res) => {
  const date = req.params.createdAt;
  let newDate = limitDate(date);

  if (canUpdate(newDate) == true) {
    const id = req.params.id;

    try {
      const [updated] = await Report.update(req.body.description, {
        where: { id },
      });

      if (updated) {
        res.status(200).json({
          message: "User updated",
          data: req.body,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(403).json({
      message: "You have exceeded the time limit to update your message",
    });
  }
};

// exports.updateDescription = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const timePassed = res.params.createdAt;

//     //Split time passed

//     let canUpdate = false;
//     let date = [{ year: 0, month: 0, day: 0, hour: 0, min: 0 }];

//     let months = [
//       { month: "01", name: "January", days: 31 },
//       { month: "02", name: "February", days: 28 },
//       { month: "03", name: "March", days: 31 },
//       { month: "04", name: "April", days: 30 },
//       { month: "05", name: "May", days: 31 },
//       { month: "06", name: "June", days: 30 },
//       { month: "07", name: "July", days: 31 },
//       { month: "08", name: "August", days: 31 },
//       { month: "09", name: "September", days: 30 },
//       { month: "10", name: "October", days: 31 },
//       { month: "11", name: "November", days: 30 },
//       { month: "12", name: "December", days: 31 },
//     ];

//     function manyDays(date) {
//       let days = 0;
//       for (let i = 0; i < months.length; i++) {
//         if (months[i].month == date.month) {
//           days = months[i].days;
//         }
//       }
//       return days;
//     }

//     function limitTime(date) {
//       let days = manyDays(date);

//       if (date.min >= 50) {
//         //52%10==2
//         date.min == data.min % 10;
//       } else {
//         date.min == date.min + 10;
//       }

//       if (date.hour == 23 && date.min >= 50) {
//         date.hour == "00"; //hour restarts

//         switch (days == date.day) {
//           case 30:
//             date.month++;
//             break;
//           case 31:
//             let isDecember = false;
//             for (let i = 0; i < months.length; i++) {
//               if (months[i].month == date.month) {
//                 if (months[i].name == "December") {
//                   date.year++;
//                   date.month = "01";
//                 } else {
//                   date.month++;
//                 }
//               }
//             }
//             break;
//           case 28:
//             date.month++;
//             break;
//         }
//       }
//     }

//     function updatePermited() {}
//   } catch {}
// }
