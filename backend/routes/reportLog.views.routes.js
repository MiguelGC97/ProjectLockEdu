module.exports = (app) => {
    
  const reportLog = require("../controllers/reportLog.views.controller.js");

  var router = require("express").Router();

  router.post("/", reportLog.storeReportLog);

  router.get("/", reportLog.index);

  router.get("/create", reportLog.create);

  router.get("/:id", reportLog.edit);

  router.put("/:id", reportLog.update);

  app.use("/reportLog", router);
};
