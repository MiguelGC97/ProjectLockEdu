module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const auth = require("../controllers/auth.js");

  var router = require("express").Router();

  router.post("/", reports.createReport);

  //   router.get("/", auth.isAuthenticated, reports.getAll);

  router.post("/:username", reports.getReportByUsername);

  //   router.put("/:id", auth.isAuthenticated, reports.resolveReport);

  app.use("/api/reports", router);
};
