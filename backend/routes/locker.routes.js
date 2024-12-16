module.exports = (app) => {
  const lockers = require("../controllers/locker.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");


  var router = require("express").Router();

  router.post("/", auth.isAuthenticated, lockers.addLocker);

  router.get("/", auth.isAuthenticated, lockers.getAll); //lembrar de poner auth.isAuthenticated aqui después (sarah)

  router.put("/:id", auth.isAuthenticated, lockers.update);

  router.delete("/:id", auth.isAuthenticated, lockers.delete);

  app.use("/api/lockers", router);
};


