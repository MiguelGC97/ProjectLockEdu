module.exports = (app) => {
  const settings = require("../controllers/settings.controller.js");
  const permissions = require("../middlewares/permissions.js");
  const auth = require("../middlewares/auth.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.addSettings
  );

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.getAll
  );

  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.getOne
  );

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.update
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.delete
  );

  app.use("/api/settings", router);
};
