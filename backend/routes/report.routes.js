module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post("/", reports.createReport);


  router.get("/", reports.getAll);


  router.get("/:username",  auth.isAuthenticated, reports.getReportByUsername);

  router.get("/user/:userId",auth.isAuthenticated, reports.getReportByUserId);

  router.put("/update/:id",auth.isAuthenticated, reports.updateDescription);

  // router.put("/:id",  reports.resolveReport);
 
  app.use("/api/reports",auth.isAuthenticated, router);  
};