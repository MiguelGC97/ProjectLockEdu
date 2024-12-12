module.exports = app => {
  const boxes = require("../controllers/box.controller.js");
  const auth = require("../middlewares/auth.js");
  const upload = require('../multer/upload');

  var router = require("express").Router();

  router.post("/", auth.isAuthenticated, upload.single('file'), boxes.addBox);

  router.get("/", boxes.getAll);

  router.get("/:id", auth.isAuthenticated, boxes.getOne);

  router.put("/:id", auth.isAuthenticated, boxes.update);

  router.delete("/:id", auth.isAuthenticated, boxes.delete);

  router.get("/locker/:id", boxes.getAllbyLockerId);

  app.use("/api/boxes", router);
};
