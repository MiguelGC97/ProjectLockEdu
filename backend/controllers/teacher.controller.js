const db = require("../models");
const Teacher = db.teacher;
const User = db.user;
const bcrypt = require("bcryptjs");
const utils = require("../utils");

exports.createTeacher = async (req, res) => {
  const { name, surname, username, password, avatar, shift } = req.body;

  try {
    if (!username || !password || !shift) {
      return res.status(400).json({ message: "data required" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "the user you try to register is already registered",
        });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      name,
      surname,
      username,
      password: hashedPassword,
      avatar,
      role: "TEACHER",
    });

    const teacher = await Teacher.create({
      shift,
      userId: user.id, //id de user
    });

    const token = utils.generateToken(user);

    res.status(201).json({
      teacher: { id: teacher.id, shift: teacher.shift },
      user: utils.getCleanUser(user),
      access_token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "surname", "username", "avatar"],
        },
      ],
    });
    res.status(200).json({ data: teachers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
