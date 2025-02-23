module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const authForReact = require("../middlewares/authForReact.session.js");
  const authSession = require("../middlewares/auth.session.js");
  const { uploadAvatar } = require("../multer/upload");
  const deleteImg = require('../multer/delete');

  const permissions = require("../middlewares/permissions.js");

  var router = require("express").Router();

  router.post(
    "/",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.addNewUser
  );

  router.post('/upload', uploadAvatar.single('file'), (req, res) => {
    if (req.file) {
      res.json({
        message: 'Avatar subido con éxito.',
        filepath: `/uploads/${req.file.filename}`,
      });
    } else {
      res.status(400).json({ message: 'Ningun archivo enviado.' });
    }
  });

  router.delete('/delete-avatar/:filename', async (req, res) => {
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
    permissions.authorize(["ADMIN"]),
    users.getAll
  );

  router.get(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.findOneById
  );

  router.get(
    "/username/:username",
    permissions.authorize(["ADMIN"]),
    authForReact.isAuthenticated,
    users.getByUsername
  );

  router.get(
    "/settings/:id",
    permissions.authorize(["ADMIN"]),
    authForReact.isAuthenticated,
    users.getUserSettings
  );

  router.put(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.update
  );

  router.delete(
    "/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.delete
  );

  router.post("/signin", authForReact.signin);

  router.get("/validateSession", authForReact.isAuthenticated, (req, res) => {
    if (req.session && req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }
    return res.status(401).json({ message: "Session expired or invalid" });
  });

  router.put(
    "/password/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]),
    users.updatePassword
  );

  router.put(
    "/own-password/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER"]),
    users.updateOwnPassword
  );

  router.post('/upload', uploadAvatar.single('file'), permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), (req, res) => {
    if (req.file) {
      res.json({
        message: 'Imagen de perfil subida con éxito.',
        filepath: `/uploads/${req.file.filename}`,
      });
    } else {
      res.status(400).json({ message: 'Ningun archivo enviado.' });
    }
  });

  router.delete('/delete-avatar/:filename', permissions.authorize(["ADMIN", "TEACHER", "MANAGER"]), async (req, res) => {
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

  router.put(
    "/update-avatar/:id",
    authForReact.isAuthenticated,
    permissions.authorize(["TEACHER", "ADMIN", "MANAGER"]),
    users.updateAvatar
  );

  app.use("/api/users", router);
};
