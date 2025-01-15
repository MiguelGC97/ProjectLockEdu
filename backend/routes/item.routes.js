module.exports = (app) => {
  const items = require("../controllers/item.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    items.addItem
  );

  router.get("/", items.getAll);

  router.get("/box/:id", items.getAllByBoxId);

  router.delete("/:id", permissions.authorize(["ADMIN"]), auth.isAuthenticated, items.delete);

  app.use("/api/items", router);
};
