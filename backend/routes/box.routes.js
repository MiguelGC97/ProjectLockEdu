module.exports = app => {
    const boxes = require("../controllers/box.controller.js");

    var router = require("express").Router();

    router.post("/", boxes.create);

    router.get("/", boxes.findAll);

    router.get("/:id", boxes.findOne);

    router.put("/:id", boxes.update);

    router.delete("/:id", boxes.delete);

    app.use("/api/boxes", router);
    
}