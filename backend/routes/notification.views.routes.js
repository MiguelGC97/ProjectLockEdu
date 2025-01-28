module.exports = app => {
    const notifications = require("../controllers/notification.views.controller.js");
    const authSession = require("../controllers/auth.session.js");

    var router = require("express").Router();

    // Save a new Motorbike
    router.post("/", notifications.store);

    // Retrieve all notifications
    router.get("/", notifications.index);

    // Show Form to create a new Motorbike
    router.get("/create", notifications.create);

    // Show Motorbike with id
    // router.get("/:id", authSession.isAuthenticated, notifications.show);

    // Show form to edit Motorbike with id
    router.get("/edit/:id", notifications.edit);

    // Update a Motorbike with id
    router.post("/update/:id", notifications.update);

    // Delete a Motorbike with id
    router.post("/delete/:id", notifications.destroy);

    app.use('/notifications', router);
};