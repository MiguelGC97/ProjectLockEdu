module.exports = (app) => {
  const reportLog = require("../controllers/reportLog.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.getAllReportLogs
  );
  router.get(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.getReportLogById
  );
  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.createReportLog
  );
  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.updateReportLog
  );
  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.deleteReportLog
  );

  app.use("/api/reportLog", router);
};
