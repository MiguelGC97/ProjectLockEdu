module.exports = (app) => {
  const reportLog = require("../controllers/reportLog.views.controller.js");
  const authSession = require("../middlewares/auth.session.js");
  var router = require("express").Router();

  router.post("/", authSession.isAuthenticated, reportLog.store);

  router.get("/", authSession.isAuthenticated, reportLog.index);

  router.get("/:id", authSession.isAuthenticated, reportLog.edit);

  router.post("/:id", authSession.isAuthenticated, reportLog.update);

  app.use("/reportLog", router);
};
