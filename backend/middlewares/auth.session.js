const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;

exports.login = async (req, res) => {
  if (req.session.user) {
    return res.redirect("/locker");
  }

  //reportLog page will be rendered if user is already logged in
  res.render("login");
};

exports.signin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.render("error", {
      message: "Username or Password required.",
    });
  }

  const user = req.body.username;
  const pwd = req.body.password;
  //   const role = req.body.role;
  //I was thinking about implementing the role feature but i think it is possible to implement it trough the autorization middleware

  try {
    const data = await User.findOne({ where: { username: user } });
    if (!data) {
      return res.render("error", { message: "User not found!" });
    }

    const result = await bcrypt.compare(pwd, data.password);
    if (!result) {
      return res.render("error", {
        message: "Password not valid!.",
      });
    }

    req.session.user = {
      username: data.username,
      id: data.id,
    };

    return res.redirect("/locker");
  } catch (err) {
    return res.render("error", {

      message: err.message || "Some error occurred while retrieving dashboard.",
    });
  }
};

exports.isAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  next();
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/locker');
    }

    res.clearCookie('connect.sid'); // Explicitly clear the session cookie

    res.redirect('/users/login');
  });
};

exports.setUserLocals = (req, res, next) => {
  console.log("Session user:", req.session.user); // Debug session
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  console.log("Res.locals.user:", res.locals.user); // Debug res.locals
  next();
};