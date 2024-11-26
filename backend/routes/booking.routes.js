module.exports = app => {
    const bookings = require("../controllers/booking.controller.js");

    var router = require("express").Router();

    router.post("/", bookings.addBooking);

    router.get("/", bookings.getAll);

    router.get("/:id", bookings.getOne);

    router.put("/:id", bookings.update);

    router.delete("/:id", bookings.delete);

    app.use("/api/bookings", router);
    
}