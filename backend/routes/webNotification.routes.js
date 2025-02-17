module.exports = (app) => {
  const notifications = require("../controllers/webNotification.controller.js");
  const permissions = require("../middlewares/permissions.js");
  const auth = require("../middlewares/auth.js");

  var router = require("express").Router();

  router.post(
    "/",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    notifications.saveNotification,
  );

  router.delete(
    "/",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    notifications.deleteNotification,
  );

  router.post(
    "/send",
    // auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    notifications.sendNotificationToUser,
  );

  app.use("/api/webNotifications", router);
};
