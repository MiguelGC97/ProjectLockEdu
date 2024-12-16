module.exports = (app) => {
  const types = require("../controllers/type.controller.js");

  const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post(
    "/",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    types.addType
  );

  router.get(
    "/",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    types.getAll
  );

  router.get(
    "/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    types.getOne
  );

  router.put(
    "/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    types.update
  );

  router.delete(
    "/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    types.delete
  );

  app.use("/api/types", router);
};
