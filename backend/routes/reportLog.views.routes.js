module.exports = (app) => {
  const reportLog = require("../controllers/reportLog.views.controller.js");
  const authSession = require("../middlewares/auth.session.js");
  var router = require("express").Router();

  router.post("/", authSession.isAuthenticated, reportLog.store);

  router.get("/", authSession.isAuthenticated, reportLog.index);

  router.get("/create", authSession.isAuthenticated, reportLog.create);

  router.get("/:id", authSession.isAuthenticated, reportLog.edit);

  router.post("/update/:id", authSession.isAuthenticated, reportLog.update);

  router.post("/:id", authSession.isAuthenticated, reportLog.destroy);

  app.use("/reportLog", router);
};
