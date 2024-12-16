module.exports = (app) => {
  const lockers = require("../controllers/locker.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    lockers.addLocker
  );

  router.get(
    "/",
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    auth.isAuthenticated,
    lockers.getAll
  );

  router.put(
    "/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    lockers.update
  );

  router.delete(
    "/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    lockers.delete
  );

  app.use("/api/lockers", router);
};
