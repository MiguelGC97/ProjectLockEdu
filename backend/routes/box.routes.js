module.exports = app => {
    const boxes = require("../controllers/box.controller.js");

    const upload = require('../multer/upload');

  var router = require("express").Router();

    router.post("/", upload.single('file'), boxes.addBox);

  router.get("/", boxes.getAll);

  router.get("/:id", boxes.getOne);

  router.put("/:id", boxes.update);

  router.delete("/:id", boxes.delete);

  app.use("/api/boxes", router);
};
