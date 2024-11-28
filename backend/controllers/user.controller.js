const db = require("../models");

const User = db.user;

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

exports.updatePassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10); //hash the new password
    }

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await User.update(req.body.password, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Profile updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const id = req.params.id;

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await User.update(req.body.username, { where: { id } });

    if (updated) {
      res.status(200).json({
        message: "Profile updated",
        data: req.body,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};