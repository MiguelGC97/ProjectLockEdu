module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const authForReact = require("../middlewares/authForReact.session.js");
  const authSession = require("../middlewares/auth.session.js");

  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.addNewUser
  );

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.getAll
  );

  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.findOne
  );

  router.get(
    "/username/:username",
    permissions.authorize(["ADMIN"]),
    authForReact.isAuthenticated,
    users.getByUsername
  );

  router.get(
    "/settings/:id",
    permissions.authorize(["ADMIN"]),
    authForReact.isAuthenticated,
    users.getUserSettings
  );

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.update
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.delete
  );

  router.post("/signin", authForReact.signin);

  router.get("/validateSession", authForReact.isAuthenticated, (req, res) => {
    if (req.session && req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }
    return res.status(401).json({ message: "Session expired or invalid" });
  });


  app.use("/api/users", router);
};
