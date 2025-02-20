module.exports = app => {
    const subscriptions = require("../controllers/subscription.controller");
    const auth = require("../middlewares/auth.js");
    const permissions = require("../middlewares/permissions.js");

    var router = require("express").Router();

    router.post("/subscribe", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.create,);

    router.post("/sendNotificationToSubscriptionName", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.sendNotificationToSubscriptionName);

    router.post("/sendNotificationToUserId", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.sendNotificationToUserId);

    router.post("/deleteByEndpoint", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.deleteByEndpoint);

    router.post("/getSubscriptionByEndpoint", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.findOne);

    router.get("/", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.findAll);

    router.put("/", auth.isAuthenticated,
        permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), subscriptions.update);

    app.use("/api/subscriptions", router);
}