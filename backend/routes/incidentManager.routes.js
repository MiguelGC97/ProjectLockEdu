module.exports = (app) => {
  const managers = require("../controllers/incidentManager.controller.js");
  const auth = require("../controllers/auth.js");
  
  var router = require("express").Router();

  router.put("/modificateProfile/:id", auth.isAuthenticated, managers.updateManagerUsername, managers.updateManagerPassword);

  app.use("/api/incidentManager", router);
};
