module.exports = app => {
    const bookings = require("../controllers/booking.controller.js");
    const auth = require("../middlewares/auth.js");
    const permissions = require("../middlewares/permissions.js");

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated, permissions.authorize(["TEACHER"]), bookings.newBooking);

    router.post("/:id/items", bookings.addItemToBooking);

    router.get("/", auth.isAuthenticated, bookings.getAll);

    router.get("/:id", bookings.getOne);

    router.delete("/:id", bookings.delete);

    app.use("/api/bookings", router);
    
}