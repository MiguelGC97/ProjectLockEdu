module.exports = (app) => {
  const boxes = require("../controllers/box.controller.js");

  const auth = require("../middlewares/auth.js");

  const upload = require("../multer/upload");

  var router = require("express").Router();

  router.post(
    "/",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    upload.single("file"),
    boxes.addBox
  );

  router.get(
    "/",
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    boxes.getAll
  );

  router.get("/:id", permissions.authorize(["ADMIN", "TEACHER"]), boxes.getOne);

  router.put(
    "/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    boxes.update
  );

  router.delete(
    "/:id",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    boxes.delete
  );

  router.get(
    "/locker/:id",
    permissions.authorize(["ADMIN"]),
    boxes.getAllbyLockerId
  );

  app.use("/api/boxes", router);
};
