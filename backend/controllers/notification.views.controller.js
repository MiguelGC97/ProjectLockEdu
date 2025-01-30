const db = require("../models");
const Notification = db.notification;
const { Op } = require("sequelize");

exports.store = async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ message: "Content is required" });
  } else if (!req.body.userId) {
    return res.status(400).json({ message: "userId is required" });
  } else if (!req.body.bookingId) {
    return res.status(400).json({ message: "bookingId is required" });
  }
  const notification = {
    userId: req.body.id,
    bookingId: req.body.bookingId,
    isRead: false,
    content: req.body.content,
    type: req.body.type,
  };

  Notification.create(notification)
    .then(data => {
      findAll(req, res);
    })
    .catch(err => {
      return res.render("error", {
        message: err.message || "Some error occurred while creating the Notification."
      });
    });
};

// Retrieve all notiications
exports.index = (req, res) => {
  findAll(req, res);
};

const findAll = (req, res) => {
  Notification.findAll()
    .then(data => {
      return res.render('notifications/index', { notiications: data });
    })
    .catch(err => {
      return res.render("error", {
        message: err.message || "Some error occurred while retrieving notiications."
      });
    });
}

// Show Form to create a new Motorbike
exports.create = (req, res) => {
  return res.render("notifications/create");
};


