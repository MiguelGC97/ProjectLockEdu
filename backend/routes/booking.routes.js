module.exports = (app) => {
    const bookings = require("../controllers/booking.controller.js");
    const auth = require("../middlewares/auth.js");
    const permissions = require("../middlewares/permissions.js");

    var router = require("express").Router();

    router.post("/", bookings.newBooking);

    router.get("/", bookings.getAll);

    router.get(
        "/:id",
        auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]),
        bookings.getOne
    );

    router.get("/users/:id", bookings.getAllbyUserId);

    router.get("/users/:userId/state/:state", bookings.getAllbyUserIdAndState);

    router.delete(
        "/:id",
        auth.isAuthenticated,
        permissions.authorize(["TEACHER", "ADMIN"]),
        bookings.delete
    );

    app.use("/api/bookings", router);
};
