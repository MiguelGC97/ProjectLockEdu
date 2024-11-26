module.exports = (app) => {
  const admins = require("../controllers/admin.controller.js");
  const teachers = require("../controllers/teacher.controller.js");
  const managers = require("../controllers/incidentManager.controller.js");
  //const users = require("../controllers/user.controller.js")

  var router = require("express").Router();

  router.post("/teacher", admins.createTeacher);
  router.put("/teacher/modificateProfile/:id", teachers.updateTeacherUsername, teachers.updateTeacherPassword);
  router.delete("/teacher/profile/:id", admins.deleteTeacher);
  router.get("/teachers-list", admins.getTeachers);
  //router.get("/teachers-list/:username", admins.getByUsername);
  //or
  //router.get("/teachers-list/:username", users.getByUsername);
  

  router.post("/manager", admins.createIncidentManager);
  router.put("/manager/modificateProfile/:id", managers.updateManagerPassword, managers.updateManagerUsername);
  router.delete("/manager/profile/:id", admins.deleteManager);
  router.get("/managers-list", admins.getIncidentManager);
  //router.get("/managers-list/:username", admins.getManagerByUsername);
  //or
  //router.get("/managers-list/:username", users.getByUsername);
  
  router.put("/modificateProfile/:id", admins.updateAdminPassword, admins.updateAdminUsername);
  router.delete("/manager/profile/:id", admins.deleteManager);
  router.get("/admins-list", admins.getAdmins);
 //router.get("/admins-list/:username", admins.getManagerByUsername);
  //or
  //router.get("/admins-list/:username", users.getByUsername);

  app.use("/api/admin", router);
};
