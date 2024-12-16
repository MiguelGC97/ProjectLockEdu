module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    permissions.authorize(["ADMIN", "TEACHER"]),
    auth.isAuthenticated,
    reports.createReport
  );

  router.get(
    "/",
    permissions.authorize(["ADMIN", "MANAGER", "TEACHER"]),
    auth.isAuthenticated,
    reports.getAll
  );

  router.get(
    "/:username",
    permissions.authorize(["ADMIN", "MANAGER"]),
    auth.isAuthenticated,
    reports.getReportByUsername
  );

  router.get(
    "/user/:userId",
    permissions.authorize(["ADMIN", "MANAGER"]),
    auth.isAuthenticated,
    reports.getReportByUserId
  );

  router.put(
    "/update/:id",
    permissions.authorize(["ADMIN", "TEACHER"]),
    auth.isAuthenticated,
    reports.updateDescription
  );

  router.put(
    "/resolve/:id",
    permissions.authorize(["ADMIN", "MANAGER"]),
    auth.isAuthenticated,
    reports.resolveReport
  );

  app.use("/api/reports", auth.isAuthenticated, router);
};
