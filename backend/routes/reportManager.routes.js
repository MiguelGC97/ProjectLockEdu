module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["MANAGER"]),
    users.updatePassword
  );

  app.use("/api/incidentManager", router);
};
