const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const utils = require("../utils");

const db = require("../models");
const User = db.user;

const validateSigninInput = (user, pwd) => {
  if (!user || !pwd) {
    throw new Error("Los campos no pueden estar vacíos.");
  }
};

const authenticateUser = async (user, pwd) => {
  const data = await User.findOne({ where: { username: user } });
  if (!data || !bcrypt.compareSync(pwd, data.password)) {
    throw new Error("Correo o contraseña inválido.");
  }
  return data;
};


exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    validateSigninInput(username, password);
    const user = await authenticateUser(username, password);

    const token = utils.generateToken(user);
    const userObj = utils.getCleanUser(user);

    res.json({ user: userObj, access_token: token });
  } catch (err) {
    const status = err.message.includes("required") ? 400 : 401;
    res.status(status).json({ error: true, message: err.message });
  }
};


const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required.");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};


const findUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("user not found.");
  }
  return user;
};


exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.token;

    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (err) {
    const status = err.message === "Unathorized." ? 500 : 401;
    res.status(status).json({ error: true, message: err.message });
  }
};
