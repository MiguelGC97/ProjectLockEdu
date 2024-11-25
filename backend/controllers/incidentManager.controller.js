const db = require("../models");
const IncidentManager = db.incidentManager;
const User = db.user;
const bcrypt = require("bcryptjs");
const utils = require("../utils");

exports.createIncidentManager = async (req, res) => {
  const { name, surname, username, password, avatar } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "required" });
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
      role: "MANAGER",
    });

    const incidentManager = await IncidentManager.create({
      userId: user.id,
    });

    const token = utils.generateToken(user);

    res.status(201).json({
      incidentManager: { id: incidentManager.id },
      user: utils.getCleanUser(user),
      access_token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncidentManager = async (req, res) => {
  try {
    const incidentManagers = await IncidentManager.findAll({
      include: ["user"],
    });
    res.status(200).json({ data: incidentManagers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
