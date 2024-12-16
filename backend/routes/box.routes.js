module.exports = (app) => {
  const boxes = require("../controllers/box.controller.js");
  const auth = require("../middlewares/auth.js");
  const upload = require("../multer/upload");
  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    upload.single("file"),
    boxes.addBox
  );

  router.get("/", boxes.getAll);

  router.get("/:id", boxes.getOne);

  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    boxes.update
  );

  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    boxes.delete
  );

  router.get("/locker/:id", boxes.getAllbyLockerId);

  app.use("/api/boxes", router);
};
