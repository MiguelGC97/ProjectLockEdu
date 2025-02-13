module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER"]),
    reports.createReport
  );

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER", "TEACHER"]),
    reports.getAll
  );

  router.get(
    "/:username",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reports.getReportByUsername
  );

  router.get(
    "/user/:userId",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reports.getReportByUserId
  );

  router.put(
    "/update/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER"]),
    reports.updateDescription
  );

  router.put(
    "/resolve/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "MANAGER"]),
    reports.resolveReport
  );

  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    reports.deleteReport
  );

  app.use("/api/reports", router);
};
