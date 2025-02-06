module.exports = (app) => {
  const reportLog = require("../controllers/reportLog.views.controller.js");
const authSession = require("../middlewares/auth.session.js");
  var router = require("express").Router();

  router.post("/create", authSession.isAuthenticated, reportLog.store);

  router.get("/list",  authSession.isAuthenticated, reportLog.index);

  router.get("/",  authSession.isAuthenticated, reportLog.create);

  router.get("/:id", authSession.isAuthenticated, reportLog.edit);

  router.post("/:id", authSession.isAuthenticated, reportLog.update);

  app.use("/reportLog", router);
};
