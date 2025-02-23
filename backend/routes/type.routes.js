module.exports = (app) => {
  const types = require("../controllers/type.controller.js");
  const permissions = require("../middlewares/permissions.js");
  const auth = require("../middlewares/auth.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.addType
  );

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    types.getAll
  );

  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.getOne
  );

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.update
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.delete
  );

  app.use("/api/types", router);
};
