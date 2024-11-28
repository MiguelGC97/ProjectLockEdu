const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const utils = require("../utils");
const User = db.user;

const validateSigninInput = (user, pwd) => {
  if (!user || !pwd) {
    throw new Error("Username or Password required.");
  }
};

const authenticateUser = async (user, pwd) => {
  const data = await User.findOne({ where: { username: user } });
  if (!data || !bcrypt.compareSync(pwd, data.password)) {
    throw new Error("Invalid username or password.");
  }
  return data;
};

// Función principal de inicio de sesión
exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    validateSigninInput(username, password); // Validar entrada
    const user = await authenticateUser(username, password); // Autenticar usuario

    const token = utils.generateToken(user); // Generar token
    const userObj = utils.getCleanUser(user); // Obtener detalles del usuario

    res.json({ user: userObj, access_token: token });
  } catch (err) {
    const status = err.message.includes("required") ? 400 : 401;
    res.status(status).json({ error: true, message: err.message });
  }
};

// Función para verificar el token JWT
const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required.");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Función para buscar el usuario en la base de datos por ID
const findUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("user not found.");
  }
  return user;
};

// Middleware de autenticación
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.token;

    const decoded = verifyToken(token); // Verificar token
    const user = await findUserById(decoded.id); // Verificar usuario

    // Añadir información del usuario autenticado al objeto req
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next(); // Continuar al siguiente middleware
  } catch (err) {
    const status = err.message === "Invalid token." ? 401 : 500;
    res.status(status).json({ error: true, message: err.message });
  }
};
