module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");

  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    users.addNewUser
  );

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.getAll
  );

  router.get(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.findOne
  );

  router.get(
    "/username/:username",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    users.getByUsername
  );

  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.update
  );

  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.delete
  );

  router.post("/signin", auth.signin);

  app.use("/api/users", router);
};
