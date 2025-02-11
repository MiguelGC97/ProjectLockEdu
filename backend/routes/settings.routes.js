module.exports = (app) => {
  const settings = require("../controllers/settings.controller.js");
  // const permissions = require("../middlewares/permissions.js");
  // const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post(
    "/",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    settings.addSettings
  );

  router.get(
    "/",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    settings.getAll
  );

  router.get(
    "/:id",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    settings.getOne
  );

  router.put(
    "/:id",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    settings.update
  );

  router.delete(
    "/:id",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    settings.delete
  );

  app.use("/api/settings", router);
};
