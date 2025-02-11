module.exports = (app) => {
    const locker = require("../controllers/locker.views.controller.js");

    var router = require("express").Router();

    router.post("/", locker.store);

    router.get("/", locker.index);

    router.get("/create", locker.create);

    router.get("/:id", locker.edit);

    router.post("/update/:id", locker.update);

    router.post("/:id", locker.destroy);

    app.use("/locker", router);
};
