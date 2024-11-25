const db = require("../models");
const Admin = db.admin;
const User = db.user;
const bcrypt = require("bcryptjs");
const utils = require("../utils");

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

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({ include: ["user"] });
    res.status(200).json({ data: admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
