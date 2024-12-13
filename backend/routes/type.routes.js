module.exports = app => {
    const types = require("../controllers/type.controller.js");
    const auth = require("../middlewares/auth.js");

    const auth = require("../middlewares/auth.js");

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated, types.addType);

    router.get("/", auth.isAuthenticated, types.getAll);

    router.get("/:id", auth.isAuthenticated, types.getOne);

    router.put("/:id", auth.isAuthenticated, types.update);

    router.delete("/:id", auth.isAuthenticated, types.delete);

    app.use("/api/types", router);

}

