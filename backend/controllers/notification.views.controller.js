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

  const notificationsPromise = Notification.findAll({
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
  });


  const usersPromise = User.findAll({
    attributes: ['id', 'name', 'surname', 'role'],
    include: [
      {
        model: Booking,
        attributes: ['id'],
      }
    ]
    
  });


  Promise.all([notificationsPromise, usersPromise])
    .then(([notificationsData, users]) => {  
      const now = new Date();  

      const notifications = notificationsData.map(notification => {
        if (notification.booking && notification.booking.checkOut) {
          const checkOut = new Date(notification.booking.checkOut);
          const diffMs = checkOut - now;

          if (diffMs < 0) {
            return {
              ...notification.toJSON(),
              timeMessage: "Tiempo expirado"
            };
          }

          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

          return {
            ...notification.toJSON(),
            diffHours,
            diffMinutes,
            timeMessage: `${diffHours} horas y ${diffMinutes} minutos`,
          };
        }
        return { ...notification.toJSON(), diffHours: null, diffMinutes: null };
      });

      return res.render('notifications/index', {
        notifications,
        users,
        activeRoute: "notifications",
        user: req.session.user,
      });
    })
    .catch(err => {
      return res.render("error", {
        message: err.message || "Some error occurred while retrieving notifications."
      });
    });
}

exports.create = (req, res) => {
  return res.render("notifications/create");
};

exports.markAsRead = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await Notification.update(
      { isRead: true },
      { where: { id: id },
    });

    if (updated) {
      return res.redirect("/notification");
    } else {
      return res.render("error", {
        message: `Could not mark as read the notification with id=${id}.`,
      });
    }
  } catch (err) {
    return res.render("error", {
      message: `Error while trying to mark as read the notification with id=${id}.`,
    });
  }
};

exports.destroy = (req, res) => {
  const id = req.params.id;

  try {
      Notification.destroy({
          where: { id: id },
      }).then((num) => {
          if (num == 1) {
              return res.redirect("/notification");
          } else {
              res.send({
                  message: `Cannot delete notification with id=${id}.`,
              });
          }
      });
  } catch (error) {
      res.status(500).send({
          message: "Could not delete notification with id=" + id,
      });
  }

}