const db = require("../models");
const Teacher = db.teacher;
const bcrypt = require("bcryptjs");


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
