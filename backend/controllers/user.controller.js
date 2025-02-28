const db = require("../models");

const User = db.user;
const Settings = db.settings;

const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();

    let cleanedUsers = users.map((user) => {
      return utils.getCleanUser(user);
    });

    res.status(200).json({ data: cleanedUsers });
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

exports.findOneById = async (req, res) => {
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
    const { name, surname, password, username, avatar, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).send({ message: "Correo electrónico, contraseña y rol son obligatorios!" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).send({ message: "Este correo electrónico ya está en uso." });
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
    return res.status(500).send({ message: err.message || "Ocurrió un error inesperado" });
  }
};




exports.delete = async (req, res) => {
  const deleting = await User.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "Usuario borrado" : "User no fue encontrado";
  return res.status(status).json({ message: message });
};




exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password, name, surname, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (username) {
      const existingUser = await User.findOne({
        where: { username, id: { [Op.ne]: id } },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Este correo ya existe." });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (role) updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const [updated] = await User.update(updateData, { where: { id } });

    if (updated) {
      const updatedUser = await User.findByPk(id);

      const updatedUserClean = utils.getCleanUser(updatedUser);


      if (req.session.user.id === updatedUser.id) {
        req.session.user = {
          ...req.session.user,
          id: updatedUser.id,
          name: updatedUser.name,
          surname: updatedUser.surname,
          username: updatedUser.username,
          avatar: updatedUser.avatar || null,
          role: updatedUser.role,
        };
        req.session.save();
      }


      return res.status(200).json({
        message: "¡Usuario actualizado con éxito!",
        updatedUserClean,
        loggedUser: req.session.user,
      });
    } else {
      return res.status(400).json({ message: "No se realizó ningún cambio." });
    }
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Un error ocurrió al editar usuario" });
  }
};





exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "¡Contraseña actualizada correctamente!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.updateOwnPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "¡Contraseña actualizada correctamente!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.updateAvatar = async (req, res) => {
  try {

    const id = req.params.id;
    const { avatar } = req.body;

    // if (!avatar) {
    //   return res.status(400).json({ message: "Avatar URL is required" });
    // }

    const [updated] = await User.update(
      { avatar },
      { where: { id: id } }
    );

    if (updated) {
      const updatedUser = await User.findByPk(id);


      if (req.session.user.id === updatedUser.id) {
        req.session.user = {
          ...req.session.user,
          id: updatedUser.id,
          name: updatedUser.name,
          surname: updatedUser.surname,
          username: updatedUser.username,
          avatar: updatedUser.avatar || null,
        };
        req.session.save();
      }

      const updatedUserClean = utils.getCleanUser(updatedUser);

      return res.status(200).json({
        message: "¡Avatar actualizado con éxito!",
        updatedUserClean,
        loggedUser: req.session.user,
      });
    } else {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

