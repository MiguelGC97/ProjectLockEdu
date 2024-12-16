module.exports = (app) => {
    const bookings = require("../controllers/booking.controller.js");
    const auth = require("../middlewares/auth.js");
    const permissions = require("../middlewares/permissions.js");

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]), bookings.newBooking);

    router.get("/", auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]), bookings.getAll);

    router.get(
        "/:id",
        auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]),
        bookings.getOne
    );

    router.get("/users/:id", auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]), bookings.getAllbyUserId);

    router.get("/users/:userId/state/:state", auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]), bookings.getAllbyUserIdAndState);

    router.delete(
        "/:id",
        auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]),
        bookings.delete
    );

    app.use("/api/bookings", router);
};
