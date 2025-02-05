const db = require("../models");
const Notification = db.notification;
const User = db.user;
const Booking = db.booking;
const Item = db.item;
const Box = db.box;
const Locker = db.locker;
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
    userId: req.body.userId,
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
  Notification.findAll(
    {
      include: [
        {
          model: User,
          attributes: ['name', 'surname', 'role'],
        },
        {
          model: Booking,
          attributes: ['id','checkOut', 'checkIn'],
          include: [
            {
              model: Item,
              attributes: ['id'],
              include: [
                {
                  model: Box,
                  attributes: ['id'],
                  include: [
                    {
                      model: Locker,
                      attributes: ['id'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  )
    .then(data => {
      return res.render('notifications/index', { notifications: data, activeRoute: "notifications"  });
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


