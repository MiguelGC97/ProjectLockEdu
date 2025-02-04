module.exports = app => {
  const authSession = require("../middlewares/auth.session.js");

  var router = require("express").Router();

  
  router.get("/login", authSession.login);

  // Sign in a user
  router.post("/signin", authSession.signin);

  // Logout
  router.post("/logout", authSession.logout);

  app.use('/users', router);
};