module.exports = app => {
    const types = require("../controllers/type.controller.js");

    var router = require("express").Router();

    router.post("/", types.addType);

    router.get("/", types.getAll);

    router.get("/:id", types.getOne);

    router.put("/:id", types.update);

    router.delete("/:id", types.delete);

    app.use("/api/types", router);
    
}