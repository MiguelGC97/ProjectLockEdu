module.exports = app => {
    const reports = require("../controllers/report.controller.js");
    const auth = require("../controllers/auth.js");

    var router = require("express").Router();

    router.post("/", reports.createReport);

    router.get("/", auth.isAuthenticated, reports.getAll);

    // router.get("/:id", auth.isAuthenticated, reports.findOne);

    // router.get("/username/:username", auth.isAuthenticated, reports.getByUsername); 

    router.put("/:id", auth.isAuthenticated, reports.resolveReport);
    
    router.put("manage/:id", auth.isAuthenticated, reports.resolveReport);


    app.use("/api/reports", router);


    
}