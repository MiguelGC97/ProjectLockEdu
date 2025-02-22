module.exports = (app) => {
  const boxes = require("../controllers/box.controller.js");
  const auth = require("../middlewares/auth.js");
  const upload = require("../multer/upload");
  const deleteImg = require('../multer/delete');
  const permissions = require("../middlewares/permissions.js");
  const authForReact = require("../middlewares/authForReact.session.js");
  const path = require('path');
  const fs = require('fs');



  var router = require("express").Router();


  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    boxes.addBox
  );


  router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      res.json({
        message: 'Imagen de la casilla subida con éxito.',
        filepath: `/uploads/${req.file.filename}`,
      });
    } else {
      res.status(400).json({ message: 'Ningun archivo enviado.' });
    }
  });


  router.delete('/delete-box-image/:filename', async (req, res) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({ message: 'Filename is required' });
      }

      await deleteImg(filename);

      res.json({ message: 'Old image deleted successfully' });

    } catch (error) {
      console.error('Error deleting file:', error.message);
      res.status(500).json({ message: error.message || 'Error deleting the image' });
    }
  });



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
