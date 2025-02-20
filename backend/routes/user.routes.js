module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const authForReact = require("../middlewares/authForReact.session.js");
  const authSession = require("../middlewares/auth.session.js");

  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
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

  router.get(
    "/settings/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    users.getUserSettings
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

  router.post("/signin", authForReact.signin);



  app.use("/api/users", router);
};
