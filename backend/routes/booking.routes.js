module.exports = app => {
    const bookings = require("../controllers/booking.controller.js");
    const auth = require("../middlewares/auth.js");
    const permissions = require("../middlewares/permissions.js");

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated, permissions.authorize(["TEACHER"]), bookings.addBooking);

    router.get("/", auth.isAuthenticated, bookings.getAll);

    router.get("/:id", auth.isAuthenticated, bookings.getOne);

    router.delete("/:id", auth.isAuthenticated, bookings.delete);

    app.use("/api/bookings", router);

}