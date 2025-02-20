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


  User.findOne({ where: { username: user.username } })
    .then(data => {
      if (data && data.password === user.password) {
        req.session.user = data;
        return res.redirect("/locker");
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
    role: req.session.user.role,
    surname: req.session.user.surname,
  }


  User.findOne({ where: { username: user.username } }).then(user => {
    res.render("partials/userbar", { user: user });
  })

}