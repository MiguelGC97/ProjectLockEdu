module.exports = (app) => {
  const notifications = require("../controllers/notification.controller.js");
  const permissions = require("../middlewares/permissions.js");
  const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.addNotification
  );

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.getAll
  );

  router.get(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.getOne
  );

  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.update
  );

  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    notifications.delete
  );

  app.use("/api/notifications", router);
};
