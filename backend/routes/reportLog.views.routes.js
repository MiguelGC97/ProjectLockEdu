module.exports = (app) => {
    
  const reportLog = require("../controllers/reportLog.views.controller.js");

  var router = require("express").Router();

  // router.post("/", reportLog.store);

  router.get("/", reportLog.index);

  // router.get("/create", reportLog.create);

  // router.get("/:id", reportLog.edit);

  // router.post("/:id", reportLog.update);

  app.use("/reportlog", router);
};
