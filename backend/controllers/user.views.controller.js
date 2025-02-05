const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;


// Returns login view
exports.login = (req, res) => {
  return res.render("login");
};

// Sign in
exports.signin = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    return res.render("error", {
      message: "Username and password are mandatory!"
    });
  }

  const user = {
    username: req.body.username,
    password: req.body.password
  }

  // Save reportLog in the database
  User.findOne({ where: { username: user.username } })
    .then(data => {
      findAll(req, res);
    })
    .catch(err => {
      return res.render("error", {
        message: err.message || "Some error occurred while creating the Motorbike."
      });
    });
};