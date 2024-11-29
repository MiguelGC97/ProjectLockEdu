module.exports = (app) => {

  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();


  router.get("/", auth.isAuthenticated, permissions.authorize(["ADMIN"]), users.getAll);
  router.get("/:username", auth.isAuthenticated, permissions.authorize(["ADMIN"]), users.getByUsername);
  router.get("/:id", auth.isAuthenticated, permissions.authorize(["ADMIN"]), users.findOne);
  router.post("/", auth.isAuthenticated, permissions.authorize(["ADMIN"]), users.addNewUser);
  router.delete("/:id", auth.isAuthenticated, permissions.authorize(["ADMIN"]), users.delete);
  router.get("/", auth.isAuthenticated, permissions.authorize(["ADMIN"]), users.updatePassword);

  app.use("/api/admin", router);

};
