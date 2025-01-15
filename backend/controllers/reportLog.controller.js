const db = require("../models");
const ReportLog = db.reportLog;

// Get all report logs
exports.getAllReportLogs = async (req, res) => {
    try {
        const reportLog = await ReportLog.findAll();
        res.status(200).json({ data : reportLog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single report log by ID
exports.getReportLogById = async (req, res) => {
    try {
        const reportLog = await ReportLog.findOne({ where: { id: req.params.id } });
        if (!reportLog) {
            return res.status(404).json({ message: 'Report log not found' });
        }
        res.status(200).json({ data : reportLog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new report log
exports.createReportLog = async (req, res) => {
    const reportLog = new ReportLog(req.body);
    try {
        const newReportLog = await reportLog.save();
        res.status(201).json({ data : newReportLog });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing report log
exports.updateReportLog = async (req, res) => {
    try {
        const [updated] = await ReportLog.update(req.body, { where: { id: req.params.id } });
        const updatedReportLog = await ReportLog.findOne({ where: { id: req.params.id } });
        if (!updatedReportLog) {
            return res.status(404).json({ message: 'Report log not found' });
        }
        res.status(200).json(updatedReportLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a report log
exports.deleteReportLog = async (req, res) => {
    try {
        const deletedReportLog = await ReportLog.destroy({ where: { id: req.params.id } });
        if (!deletedReportLog) {
            return res.status(404).json({ message: 'Report log not found' });
        }
        res.status(200).json({ message: 'Report log deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};