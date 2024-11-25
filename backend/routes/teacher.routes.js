module.exports = (app) => {
  const teachers = require("../controllers/teacher.controller.js");

  var router = require("express").Router();

  router.post("/", teachers.createTeacher);
  router.get("/", teachers.getTeachers);

  app.use("/api/teacher", router);
};
