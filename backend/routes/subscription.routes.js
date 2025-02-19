module.exports = app => {
    const subscriptions = require("../controllers/subscription.controller");
    const auth = require("../middlewares/auth.js");
    const permissions = require("../middlewares/permissions.js");

    var router = require("express").Router();

    router.post("/subscribe", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.create,);

    router.post("/sendNotificationToSubscriptionName", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.sendNotificationToSubscriptionName);

    router.post("/deleteByEndpoint", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.deleteByEndpoint);

    router.get("/", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.findAll);

    router.get("/:id", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.findOne);

    router.put("/", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.update);

    app.use("/api/subscriptions", router);
}