module.exports = (app) => {
  const reportLogController = require("../controllers/reportLog.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["MANAGER", "TEACHER"]),
    reportLogController.getAllReportLogs
  );
  router.get(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["MANAGER", "TEACHER"]),
    reportLogController.getReportLogById
  );
  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["MANAGER", "TEACHER"]),
    reportLogController.createReportLog
  );
  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["MANAGER", "TEACHER"]),
    reportLogController.updateReportLog
  );
  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["MANAGER", "TEACHER"]),
    reportLogController.deleteReportLog
  );

  app.use("/api/reportLog", router);
};
