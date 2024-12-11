module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post("/", auth.isAuthenticated, reports.createReport);

  router.get("/", auth.isAuthenticated, reports.getAll);

  router.get("/:username", auth.isAuthenticated, reports.getReportByUsername);

  router.put("/:id", auth.isAuthenticated, reports.resolveReport);

  app.use("/api/reports", router);
};
