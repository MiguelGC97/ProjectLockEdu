module.exports = app => {
    const items = require("../controllers/item.controller.js");

    const auth = require("../middlewares/auth.js");

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated, items.addItem);

    router.get("/", items.getAll);

    router.delete("/:id", auth.isAuthenticated, items.delete);

    app.use("/api/items", router);

}