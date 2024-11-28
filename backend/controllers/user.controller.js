const db = require("../models");

const User = db.user;
const Admin = db.admin;

const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const q = req.params.username;
    const users = await User.findAll({
      where: { username: { [Op.like]: "%" + q + "%" } },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await User.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `User with id=${id} not found.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving User with id=${id}.`,
    });
  }
};

exports.addNewUser = async (req, res) => {
  try {
    // Validate request
    if (!req.body.password || !req.body.username) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    // Create a User object
    let user = {
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      username: req.body.username,
      avatar: req.body.avatar,
      role: req.body.role,
    };

    // Check if a user with the same username already exists
    const existingUser = await User.findOne({
      where: { username: user.username },
    });
    if (existingUser) {
      const isPasswordValid = bcrypt.compareSync(
        user.password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return res.status(401).send("Password not valid!");
      }

      // Generate token and return user data
      const token = utils.generateToken(existingUser);
      const userObj = utils.getCleanUser(existingUser);
      return res.json({ user: userObj, access_token: token });
    }

    // If user does not exist, hash password and save new user
    user.password = bcrypt.hashSync(req.body.password);

    const newUser = await User.create(user);

    // Generate token and return user data
    const token = utils.generateToken(newUser);
    const userObj = utils.getCleanUser(newUser);
    return res.json({ user: userObj, access_token: token });
  } catch (err) {
    // Handle errors
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};

exports.delete = async (req, res) => {
  const deleting = await User.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404; //operador ternario.  condición ? valor_si_verdadero : valor_si_falso
  const message = deleting ? "User deleted" : "User not found";
  res.status(status).json({ message });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10); //hash the new password
    }

    const [updated] = await User.update(req.body, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "User updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Admin

exports.createAdmin = async (req, res) => {
  const { name, surname, username, password, avatar } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "data required" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        message: "The user you try to register is already registered",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      name,
      surname,
      username,
      password: hashedPassword,
      avatar,
      role: "ADMIN",
    });

    const admin = await Admin.create({
      userId: user.id,
    });

    const token = utils.generateToken(user);

    res.status(201).json({
      admin: { id: admin.id },
      user: utils.getCleanUser(user),
      access_token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  const deleting = await Admin.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "User deleted" : "User not found";
  res.status(status).json({ message });
};
