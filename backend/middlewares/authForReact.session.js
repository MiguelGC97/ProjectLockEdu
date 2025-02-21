const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;

exports.login = async (req, res) => {
  if (req.session.user) {
    return res.redirect("/locker");
  }


  res.render("login");
};

exports.signin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Correo eletrónico y contraseña son obligatorios." });
  }

  const user = req.body.username;
  const pwd = req.body.password;

  try {
    const data = await User.findOne({ where: { username: user } });
    if (!data) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const result = await bcrypt.compare(pwd, data.password);
    if (!result) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }


    req.session.user = {
      username: data.username,
      id: data.id,
      name: data.name,
      surname: data.surname,
      avatar: data.avatar,
      role: data.role,
    };


    return res.status(200).json({ user: req.session.user });

  } catch (err) {
    return res.status(500).json({ message: err.message || "Algun error ocurrió." });
  }
};



exports.setUserLocals = (req, res, next) => {

  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }

  next();
};



exports.isAuthenticated = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized: No valid session" });
};