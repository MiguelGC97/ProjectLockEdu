module.exports = app => {
    const notifications = require("../controllers/notification.views.controller.js");

    const authSession = require("../middlewares/auth.session.js");

    var router = require("express").Router();

    router.post("/", authSession.isAuthenticated, notifications.store);

    router.post("/notifications/:id/read", authSession.isAuthenticated, notifications.markAsRead);


    router.get("/", authSession.isAuthenticated, notifications.index);

    router.get("/create", authSession.isAuthenticated, notifications.create);

    app.use('/notification', router);
};