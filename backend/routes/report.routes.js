module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post("/", reports.createReport);


  router.get("/", reports.getAll);


  router.get("/:username",  reports.getReportByUsername);

  router.get("/user/:userId", reports.getReportByUserId);

  router.put("/update/:id", reports.updateDescription);

  // router.put("/:id",  reports.resolveReport);
 
  app.use("/api/reports", router);  
};
