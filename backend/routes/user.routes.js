module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../controllers/auth.js");

  //dr3am--was thinking about doing a general findAll that shows all the data included the ones in the tables teacher, Admin and Manager. logic to elect the table dependant of user role.

  var router = require("express").Router();

  router.post("/", users.addNewUser);

  router.get("/", auth.isAuthenticated, users.getAll);

  router.get("/:id", auth.isAuthenticated, users.findOne);

  router.get("/username/:username", auth.isAuthenticated, users.getByUsername);

  router.put("/:id", auth.isAuthenticated, users.update);

  router.delete("/:id", auth.isAuthenticated, users.delete);

  router.post("/admin", users.createAdmin);

  router.post("/admin/delete/:id", auth.isAuthenticated, users.deleteAdmin);

  router.post("/signin", auth.signin);

  app.use("/api/users", router);
};
