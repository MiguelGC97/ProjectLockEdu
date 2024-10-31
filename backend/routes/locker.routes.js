module.exports = app => {
    const lockers = require("../controllers/locker.controller.js");

    var router = require("express").Router();

    router.post("/", lockers.create);

    router.get("/", lockers.findAll);

    router.put("/:id", lockers.update);

    router.delete("/:id", lockers.delete);

    app.use("/api/lockers", router);

}