module.exports = (app) => {
  const settings = require("../controllers/settings.controller.js");
  const permissions = require("../middlewares/permissions.js");
  const auth = require("../middlewares/auth.js");
  const authForReact = require("../middlewares/authForReact.session.js");
  const { uploadBanner } = require("../multer/upload");
  const deleteImg = require('../multer/delete');

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.addSettings
  );

  router.post('/upload', uploadBanner.single('file'), (req, res) => {
    if (req.file) {
      res.json({
        message: 'Avatar subido con éxito.',
        filepath: `/uploads/${req.file.filename}`,
      });
    } else {
      res.status(400).json({ message: 'Ningun archivo enviado.' });
    }
  });

  router.delete('/delete-banner/:filename', async (req, res) => {
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

  router.get(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.getAll
  );

  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.getOne
  );

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.update
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    settings.delete
  );

  app.use("/api/settings", router);
};
