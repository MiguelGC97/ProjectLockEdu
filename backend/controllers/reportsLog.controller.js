const db = require("../models");
const Report = db.report;
const ReportsLog = db.reportsLog;
const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op, AccessDeniedError } = require("sequelize");

exports.getAll = async (req, res) => {
    try {
        const logs = await ReportsLog.findAll();
        res.status(200).json({ data: logs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// exports.getReportLogByUsername = async (req, res) => {
//     try {
//         const username = req.params.username;

//         // Buscar al usuario por username incluyendo los reportes relacionados
//         const user = await User.findOne({
//             where: { username: { [db.Op.like]: `%${username}%` } },
//             include: [
//                 {
//                     model: Report,
//                     through: { attributes: [] }, // Evitar incluir datos de la tabla intermedia
//                 },
//             ],
//         });


//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }


//         res.status(200).json({ username: user.username, reports: user.reports });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await ReportsLog.findByPk(id);
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `ReportLog with id = ${id} not found`,
            });
        }
    } catch {
        res.status(500).send({
            message: `Error retrieving Report with id= ${id}`,
        });
    }
};

exports.createReportLog = async (req, res) => {
    try {
        if (!req.body.description || !req.body.managerName) {
            return res.status(400).send({
                message: "Description or manager name field cannot be empty!",
            });
        }

        let log = {
            managerName: req.body.managerName,
        };

        const newLog = await ReportsLog.create(log);

        // Generate token and return data
        const token = utils.generateTokenReport(newLog);
        const logObj = utils.getCleanReport(newLog);
        return res.json({ report: logObj, access_token: token });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the report log.",
        });
    }
};

// exports.resolveReport = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const [updated] = await Report.update((req.isSolved = true), {
//             where: { id },
//         });

//         if (updated) {
//             res.status(200).json({
//                 message: "Report resolved",
//             });
//         } else {
//             res.status(404).json({
//                 message: "The report you are trying to update can't be found",
//             });
//         }
//     } catch {
//         err;
//     }
//     {
//         res.status(500).json({ err: error.message });
//     }
// };

// exports.updateDescription = async (req, res) => {
//     const date = req.params.createdAt;
//     let newDate = limitDate(date);

//     if (canUpdate(newDate) == true) {
//         const id = req.params.id;

//         try {
//             const [updated] = await Report.update(req.body.description, {
//                 where: { id },
//             });

//             if (updated) {
//                 res.status(200).json({
//                     message: "User updated",
//                     data: req.body,
//                 });
//             } else {
//                 res.status(404).json({ message: "User not found" });
//             }
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     } else {
//         res.status(403).json({
//             message: "You have exceeded the time limit to update your message",
//         });
//     }
// };
