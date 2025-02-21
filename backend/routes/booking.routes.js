module.exports = (app) => {
  const bookings = require("../controllers/booking.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.newBooking
  );

  router.post(
    "/items",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.getDates
  );

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.getAll
  );

  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.getOne
  );

  router.get(
    "/users/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.getAllbyUserId
  );

  router.get(
    "/users/:userId/state/:state",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.getAllbyUserIdAndState
  );

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.changeState
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN"]),
    bookings.delete
  );

  app.use("/api/bookings", router);
};
