module.exports = (app) => {
  const incidentManagers = require("../controllers/incidentManager.controller.js");

  var router = require("express").Router();

  router.post("/", incidentManagers.createIncidentManager);
  router.get("/", incidentManagers.getIncidentManager);

  app.use("/api/incidentManager", router);
};
