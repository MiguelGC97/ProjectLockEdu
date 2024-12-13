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
    const { username } = req.params; // Extraer el username correctamente

    // Buscar al usuario por username, incluyendo los reportes relacionados
    const user = await User.findOne({
      where: { username: { [Op.like]: `%${username}%` } },
      include: [
        {
          model: Report,
          as: "reports", // Alias definido en la relación
          attributes: ["id", "content", "isSolved"], // Campos a incluir
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
      teacherId: req.body.teacherId,
      boxId:req.body.boxId,
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

// exports.resolveReport = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const [updated] = await Report.update((req.isSolved = true), {
//       where: { id },
//     });

//     if (updated) {
//       res.status(200).json({
//         message: "Report resolved",
//       });
//     } else {
//       res.status(404).json({
//         message: "The report you are trying to update can't be found",
//       });
//     }
//   } catch {
//     err;
//   }
//   {
//     res.status(500).json({ err: error.message });
//   }
// };

// exports.updateDescription = async (req, res) => {
//   const date = req.params.createdAt;
//   let newDate = limitDate(date);

//   if (canUpdate(newDate) == true) {
//     const id = req.params.id;

//     try {
//       const [updated] = await Report.update(req.body.content, {
//         where: { id },
//       });

//       if (updated) {
//         res.status(200).json({
//           message: "description updated",
//           data: req.body,
//         });
//       } else {
//         res.status(404).json({ message: "report not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.status(403).json({
//       message: "You have exceeded the time limit to update your message",
//     });
//   }
// };



exports.updateDescription = async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;

  try {
    const [updated] = await Report.update({ content }, {
      where: { id },
    });

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


// exports.updateDescription = async (req, res) => {
//   const { id } = req.params.id;
//   const { content } = req.body.content;

//   try {
//     // Buscar el reporte por ID
//     const report = await Report.findByPk(id);

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }

//     // Actualizar solo el contenido del reporte
//     report.content = content;
//     await report.save();

//     return res.status(200).json(report);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// exports.updateStatus = async (req, res) => {
  
//     const id = req.params.id;

//     try {
//       const [updated] = await Report.update(req.body.isSolved, {
//         where: { id },
//       });

//       if (updated) {
//         res.status(200).json({
//           message: "state updated",
//           data: req.body,
//         });
//       } else {
//         res.status(404).json({ message: "report not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
  
//   };
