module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");
  const permissions = require("../middlewares/permissions.js");
  
  var router = require("express").Router();

  router.put("modificateProfile/:id", auth.isAuthenticated, teachers.updateTeacherUsername, teachers.updateTeacherPassword);

  app.use("/api/teacher", router);
};
