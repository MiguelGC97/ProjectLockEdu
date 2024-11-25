module.exports = (app) => {
  const admins = require("../controllers/admin.controller.js");

  var router = require("express").Router();

  router.post("/", admins.createAdmin);
  router.get("/", admins.getAdmins);

  app.use("/api/admin", router);
};
