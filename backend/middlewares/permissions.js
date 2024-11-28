const db = require("../models");
const User = db.user;

exports.authorize = async (roles) => {
  try {
    const userRole = req.role;

    if (!userRole) {
      return res.status(401).json({ message: "Unknown role" });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "You shall not pass" });
    }

    next();
  } catch (error) {
    console.error("Autorization error", error);
    res.status(500).json({ message: "Server error" });
  }
};