const db = require("../models");

const User = db.user;
const Settings = db.settings;

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

exports.addNewUserDeprecated = async (req, res) => {
  try {
    // Validate request
    if (!req.body.password || !req.body.username) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }


    let user = {
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      username: req.body.username,
      avatar: req.body.avatar,
      role: req.body.role,
    };


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


      const token = utils.generateToken(existingUser);
      const userObj = utils.getCleanUser(existingUser);
      return res.json({ user: userObj, access_token: token });
    }


    user.password = bcrypt.hashSync(req.body.password);

    const newUser = await User.create(user);


    return res.json({ user: userObj, access_token: token });
  } catch (err) {

    res.status(401).send({
      message: err.message || "Unathorized",
    });
  }
};


exports.addNewUser = async (req, res) => {
  try {
    const { name, surname, password, username, avatar, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).send({ message: "Correo eletrónico, contraseña y rol son obligatorios!" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).send({ message: "Este usuario ya existe." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      surname,
      username,
      password: hashedPassword,
      avatar,
      role,
    });

    const userObj = utils.getCleanUser(newUser);

    return res.status(201).json({
      user: userObj,
      message: "¡Usuario creado con éxito!"
    });

  } catch (err) {
    return res.status(500).send({ message: err.message || "Internal server error" });
  }
};




exports.delete = async (req, res) => {
  const deleting = await User.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Usuario borrado" : "User no fue encontrado";
  return res.status(status).json({ message: message });
};

exports.updateDeprecated = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
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

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { username } = req.body;


    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).send({ message: "Este usuario ya existe." });
    }

    const [updated] = await User.update(req.body, { where: { id } });

    if (updated) {

      const updatedUser = await User.findByPk(id);
      res.status(200).json({
        message: "¡Usuario actualizado con suceso!",
        data: updatedUser,
      });
    } else {
      res.status(404).json({ message: "Error al editar usuario. Intente novamente." });
    }
  } catch (error) {

    console.error("Update error:", error);
    res.status(500).json({ error: "Un error ocurrió al editar usuario" });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }



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

exports.getUserSettings = async (req, res) => {
  const userId = req.params.id;

  try {
    const userSettings = await Settings.findOne({ where: { userId: userId } });

    if (!userSettings) {
      return res.status(404).json({ message: "User settings not found." });
    }

    res.status(200).json({
      settings: {
        notifications: userSettings.notifications,
        theme: userSettings.theme,
        banner: userSettings.banner
      }
    });

    console.log("User settings were successfully retrieved.");
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

