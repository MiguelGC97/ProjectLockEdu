module.exports = (app) => {
  const reportLog = require("../controllers/reportLog.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.getAllReportLogs
  );
  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.getReportLogById
  );
  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.createReportLog
  );
  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.updateReportLog
  );
  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reportLog.deleteReportLog
  );

  app.use("/api/reportLog", router);
};
