module.exports = (app) => {
  const notifications = require("../controllers/notification.controller.js");
  const permissions = require("../middlewares/permissions.js");
  const auth = require("../middlewares/auth.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.addNotification
  );

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER"]),
    notifications.getAll
  );

  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER"]),
    notifications.getOne
  );

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.update
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.delete
  );

  app.use("/api/notifications", router);
};
