const db = require("../models");

const Admin = db.admin;
const User = db.user;
const Teacher = db.teacher;
const IncidentManager = db.incidentManager;

//teacher

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

exports.updateTeacherPassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10); //hash the new password
    }

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await Teacher.update(req.body.password, { where: { id } });

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

exports.updateTeacherUsername = async (req, res) => {
  try {
    const id = req.params.id;

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await Teacher.update(req.body.username, { where: { id } });

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

exports.deleteTeacher = async (req, res) => {
  const deleting = await Teacher.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "User deleted" : "User not found";
  res.status(status).json({ message });
};

//manager

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

exports.updateManagerPassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10); //hash the new password
    }

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await IncidentManager.update(req.body.password, { where: { id } });

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

exports.updateManagerUsername = async (req, res) => {
  try {
    const id = req.params.id;

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await IncidentManager.update(req.body.username, { where: { id } });

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

exports.deleteManager = async (req, res) => {
  const deleting = await IncidentManager.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "User deleted" : "User not found";
  res.status(status).json({ message });
};


//admin

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({ include: ["user"] });
    res.status(200).json({ data: admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdminPassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10); //hash the new password
    }

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await Admin.update(req.body.password, { where: { id } });

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

exports.updateAdminUsername = async (req, res) => {
  try {
    const id = req.params.id;

    //Dr3am-- could be good if we create some email user connection so you send a email and get a link to change both email and password

    const [updated] = await Admin.update(req.body.username, { where: { id } });

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