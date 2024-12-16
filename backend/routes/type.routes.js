module.exports = (app) => {
  const types = require("../controllers/type.controller.js");
  const permissions = require("../middlewares/permissions.js");
  const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.addType
  );

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.getAll
  );

  router.get(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.getOne
  );

  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.update
  );

  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    types.delete
  );

  app.use("/api/types", router);
};
