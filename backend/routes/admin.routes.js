module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.getAll
  );
  router.get(
    "/:username",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.getByUsername
  );
  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.findOne
  );
  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.addNewUser
  );
  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.delete
  );
  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.updatePassword
  );

  app.use("/api/admin", router);
};
