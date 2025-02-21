module.exports = (app) => {
  const boxes = require("../controllers/box.controller.js");
  const auth = require("../middlewares/auth.js");
  const upload = require("../multer/upload");
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    upload.single("file"),
    boxes.addBox
  );

  router.get("/", boxes.getAll);

  router.get("/:id", boxes.getOne);

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    boxes.update
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    boxes.delete
  );

  router.get("/locker/:id", boxes.getAllbyLockerId);

  app.use("/api/boxes", router);
};
