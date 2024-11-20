module.exports = app => {
    const reports = require("../controllers/report.controller.js");
    const auth = require("../controllers/auth.js");

    var router = require("express").Router();

    router.post("/", reports.createReport);

    // router.get("/", auth.isAuthenticated, reports.getAll);

    // router.get("/:id", auth.isAuthenticated, users.findOne);

    // router.get("/username/:username", auth.isAuthenticated, users.getByUsername); 

    // router.put("/:id", auth.isAuthenticated, reports.update);

    router.put("/:id", reports.updateDescription);

    app.use("/api/reports", router);


    
}