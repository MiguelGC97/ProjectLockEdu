module.exports = app => {
    const lockers = require("../controllers/locker.controller.js");

    var router = require("express").Router();

    router.post("/", lockers.addLocker);

    router.get("/", lockers.getAll);

    router.put("/:id", lockers.update);

    router.delete("/:id", lockers.delete);

    app.use("/api/lockers", router);

}