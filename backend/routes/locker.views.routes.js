module.exports = (app) => {
    const locker = require("../controllers/locker.views.controller.js");
    const authSession = require("../middlewares/auth.session.js");

    var router = require("express").Router();

    router.post("/", authSession.isAuthenticated, locker.store);

    router.get("/", authSession.isAuthenticated, locker.index);

    router.get("/create", authSession.isAuthenticated, locker.create);

    router.get("/:id", authSession.isAuthenticated, locker.edit);

    router.post("/update/:id", authSession.isAuthenticated, locker.update);

    router.post("/:id", authSession.isAuthenticated, locker.destroy);

    app.use("/locker", router);
};
