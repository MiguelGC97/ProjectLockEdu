const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;


// Returns login view
exports.login = (req, res) => {
  return res.render("login");
};

exports.signin = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    return res.render("error", {
      message: "Correo y contraseña son obligatorios!"
    });
  }

  const user = {
    username: req.body.username,
    password: req.body.password
  };

  // Find the user in the database
  User.findOne({ where: { username: user.username } })
    .then(data => {
      if (data && data.password === user.password) { // Assuming plain text password for simplicity
        req.session.user = data; // Store user data in session
        return res.redirect("/locker"); // Redirect to the home page or dashboard
      } else {
        return res.render("error", {
          message: "Invalid username or password!"
        });
      }
    })
    .catch(err => {
      return res.render("error", {
        message: err.message || "Some error occurred while signing in."
      });
    });
};

exports.index = (req, res) => {
  findCurrentUser(req, res);
};

const findCurrentUser = (req, res) => {
  const user = {
    username: req.body.username,
    avatar: req.body.avatar,
    name: req.body.name,
  }


  User.findOne({ where: { username: user.username } }).then(user => {
    res.render("partials/userbar", { user: user });
  })

}