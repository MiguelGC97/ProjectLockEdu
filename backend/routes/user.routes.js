module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const auth = require("../controllers/auth.js");

    var router = require("express").Router();

    router.post("/", users.addNewUser);

    router.get("/", auth.isAuthenticated, users.getAll);

    router.get("/:id", auth.isAuthenticated, users.getByUsername);

    router.put("/:id", auth.isAuthenticated, users.update);

    router.delete("/:id", auth.isAuthenticated, users.delete);

    router.post("/signin", auth.signin);

    app.use("/api/users", router);


    
}