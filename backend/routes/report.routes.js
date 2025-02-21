module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER"]),
    reports.createReport
  );

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER", "TEACHER"]),
    reports.getAll
  );

  router.get(
    "/:username",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reports.getReportByUsername
  );

  router.get(
    "/user/:userId",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    reports.getReportByUserId
  );

  router.put(
    "/update/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER"]),
    reports.updateDescription
  );

  router.put(
    "/resolve/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reports.resolveReport
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    reports.deleteReport
  );

  app.use("/api/reports", router);
};
