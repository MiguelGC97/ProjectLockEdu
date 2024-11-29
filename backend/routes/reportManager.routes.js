module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  
  var router = require("express").Router();

  router.get("/", auth.isAuthenticated, permissions.authorize(["TEACHER"]), users.updatePassword);

  app.use("/api/incidentManager", router);
};
