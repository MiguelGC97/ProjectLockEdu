module.exports = app => {
    const items = require("../controllers/item.controller.js");

    var router = require("express").Router();

    router.post("/", items.addItem);

    router.get("/", items.getAll);

    router.delete("/:id", items.delete);

    app.use("/api/items", router);

}