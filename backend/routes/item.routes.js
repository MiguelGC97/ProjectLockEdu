module.exports = (app) => {
  const items = require("../controllers/item.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.post(
    "/",
    permissions.authorize(["ADMIN"]),
    authForReact.isAuthenticated,
    items.addItem
  );

  router.get("/", permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), authForReact.isAuthenticated, items.getAll);

  router.put("/:id", permissions.authorize(["ADMIN"]), authForReact.isAuthenticated, items.update);

  router.delete("/:id", permissions.authorize(["ADMIN"]), authForReact.isAuthenticated, items.delete);

  router.get("/box/:id", permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), authForReact.isAuthenticated, items.getBoxItems);

  app.use("/api/items", router);
};
