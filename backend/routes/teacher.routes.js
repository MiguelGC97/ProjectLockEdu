module.exports = (app) => {
  const teachers = require("../controllers/teacher.controller.js");
  const auth = require("../controllers/auth.js");

  var router = require("express").Router();

  router.put("modificateProfile/:id", auth.isAuthenticated, teachers.updateTeacherUsername, teachers.updateTeacherPassword);

  app.use("/api/teacher", router);
};
