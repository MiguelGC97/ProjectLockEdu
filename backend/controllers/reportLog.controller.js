const db = require("../models");
const ReportLog = db.reportLog;

if (!ReportLog) {
    throw new Error("ReportLog model is not defined in the database models.");
}


// Get all report logs
exports.getAllReportLogs = async (req, res) => {
    try {
        const reportLogs = await ReportLog.find();
        res.status(200).json(reportLogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single report log by ID
exports.getReportLogById = async (req, res) => {
    try {
        const reportLog = await ReportLog.findById(req.params.id);
        if (!reportLog) {
            return res.status(404).json({ message: 'Report log not found' });
        }
        res.status(200).json(reportLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new report log
exports.createReportLog = async (req, res) => {
    const reportLog = new ReportLog(req.body);
    try {
        const newReportLog = await reportLog.save();
        res.status(201).json(newReportLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing report log
exports.updateReportLog = async (req, res) => {
    try {
        const updatedReportLog = await ReportLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const deletedReportLog = await ReportLog.findByIdAndDelete(req.params.id);
        if (!deletedReportLog) {
            return res.status(404).json({ message: 'Report log not found' });
        }
        res.status(200).json({ message: 'Report log deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};