module.exports = (app) => {
  const admins = require("../controllers/admin.controller.js");
  const teachers = require("../controllers/teacher.controller.js");
  const managers = require("../controllers/reportManager.controller.js");
  const auth = require("../middlewares/auth.js");
  //const users = require("../controllers/user.controller.js")

  var router = require("express").Router();

  router.post("/teacher", admins.createTeacher);
  router.put("/teacher/modificateProfile/:id", auth.isAuthenticated, teachers.updateTeacherUsername, teachers.updateTeacherPassword);
  router.delete("/teacher/profile/:id", auth.isAuthenticated, admins.deleteTeacher);
  router.get("/teachers-list", auth.isAuthenticated, admins.getTeachers);
  //router.get("/teachers-list/:username", admins.getByUsername);
  //or
  //router.get("/teachers-list/:username", users.getByUsername);
  

  router.post("/manager", admins.createIncidentManager);
  router.put("/manager/modificateProfile/:id", auth.isAuthenticated, managers.updateManagerPassword, managers.updateManagerUsername);
  router.delete("/manager/profile/:id", auth.isAuthenticated, admins.deleteManager);
  router.get("/managers-list", auth.isAuthenticated, admins.getIncidentManager);
  //router.get("/managers-list/:username", admins.getManagerByUsername);
  //or
  //router.get("/managers-list/:username", users.getByUsername);
  
  router.put("/modificateProfile/:id", auth.isAuthenticated, admins.updateAdminPassword, admins.updateAdminUsername);
  router.delete("/manager/profile/:id", auth.isAuthenticated, admins.deleteManager);
  router.get("/admins-list", auth.isAuthenticated, admins.getAdmins);
 //router.get("/admins-list/:username", admins.getManagerByUsername);
  //or
  //router.get("/admins-list/:username", users.getByUsername);

  app.use("/api/admin", router);
};
