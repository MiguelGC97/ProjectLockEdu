const db = require("../models");
const Notification = db.webNotification;
const webPush = require('web-push');

exports.saveNotification = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    const userId = req.user.id;

    const notification = await Notification.create({ endpoint, keys, userId });

    res.status(201).json({ message: 'Notification saved', notification });
  } catch (error) {
    console.error('Error saving notification:', error);
    res.status(500).json({ error: 'Error saving notification' });
  }
};

exports.sendNotificationToUser = async (userId, title, body) => {
  try {
    const notifications = await Notification.findAll({ where: { userId } });

    const payload = JSON.stringify({ title, body });

    notifications.forEach((notification) => {
      webPush.sendNotification(notification, payload)
        .catch((error) => {
          console.error('Error enviando notificación:', error);
        });
    });
  } catch (error) {
    console.error('Error enviando notificaciones:', error);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { endpoint } = req.body;
    const userId = req.user.id;

    await Notification.destroy({ where: { endpoint, userId } });

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Error deleting notification' });
  }
};

