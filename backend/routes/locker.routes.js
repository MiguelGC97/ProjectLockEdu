module.exports = (app) => {
  const lockers = require("../controllers/locker.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    lockers.addLocker
  );

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    lockers.getAll
  );

  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    lockers.update
  );

  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    lockers.delete
  );

  app.use("/api/lockers", router);
};
