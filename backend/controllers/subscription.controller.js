const db = require("../models");
const Subscription = db.subscription;
const { Op } = require("sequelize");

const webPush = require('web-push');

exports.create = (req, res) => {

  if (!req.body.subscription || typeof req.body.subscription !== 'object') {
    return res.status(400).send({ message: 'Subscription object is required' });
  }

  if (!req.body.subscription.endpoint || typeof req.body.subscription.endpoint !== 'string') {
    return res.status(400).send({ message: 'Endpoint is required and must be a string' });
  }

  if (req.body.subscription.expirationTime && typeof req.body.subscription.expirationTime !== 'string') {
    return res.status(400).send({ message: 'Expiration time must be a string' });
  }

  if (!req.body.subscription.keys || typeof req.body.subscription.keys !== 'object') {
    return res.status(400).send({ message: 'Keys are required and must be an object' });
  }

  if (!req.body.subscriptionName || typeof req.body.subscriptionName !== 'string') {
    return res.status(400).send({ message: 'Subscription name is required and must be a string' });
  }

  if (!req.user.id || typeof req.user.id !== 'number') {
    return res.status(400).send({ message: 'User ID is required and must be a number' });
  }

  const subscription = {
    endpoint: req.body.subscription.endpoint,
    expirationTime: req.body.subscription.expirationTime,
    keys: JSON.stringify(req.body.subscription.keys),
    subscriptionName: req.body.subscriptionName,
    userId: req.user.id,
  };

  Subscription.create(subscription)
    .then(async (data) => {
      Subscription.findAll()
        .then((subscriptionsInDB) => {
          for (let s of subscriptionsInDB) {
            const subscriptionRecipient = {
              endpoint: s.dataValues.endpoint,
              expirationTime: s.dataValues.expirationTime,
              keys: JSON.parse(s.dataValues.keys),
            };

            const title = `New Subscription`;
            const description = `${data.subscriptionName} is now subscribed`;
            sendNotification(subscriptionRecipient, title, description);
          }
          res.status(201).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error happened',
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error happened',
      });
    });
};

exports.findAll = (req, res) => {
  Subscription.findAll().then(data => {
    res.send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "some error happened"
    })
  })
}

exports.sendNotificationToSubscriptionName = (req, res) => {

  if (!req.body.subscriptionName || typeof req.body.subscriptionName !== 'string') {
    return res.status(400).send({ message: 'Subscription name is required and must be a string' });
  }

  if (!req.body.notificationMessage || typeof req.body.notificationMessage !== 'string') {
    return res.status(400).send({ message: 'Notification message is required and must be a string' });
  }

  Subscription.findAll({
    where: {
      subscriptionName: req.body.subscriptionName,
    },
  })
    .then((subscriptionsInDB) => {
      for (const s of subscriptionsInDB) {
        const subscriptionRecipient = {
          endpoint: s.dataValues.endpoint,
          expirationTime: s.dataValues.expirationTime,
          keys: JSON.parse(s.dataValues.keys),
        };
        const title = `Just for ${req.body.subscriptionName}`;
        const description = req.body.notificationMessage;
        sendNotification(subscriptionRecipient, title, description);
      }
      res.send('Notification sent');
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error happened',
      });
    });
};

exports.sendNotificationToUserId = (req, res) => {

  if (!req.body.notificationMessage || typeof req.body.notificationMessage !== 'string') {
    return res.status(400).send({ message: 'Notification message is required and must be a string' });
  }

  if (!req.body.userId || typeof req.body.userId !== 'number') {
    return res.status(400).send({ message: 'User ID is required and must be a number' });
  }

  const userId = req.body.userId;

  Subscription.findAll({
    where: {
      userId: userId,
    },
  })
    .then((subscriptionsInDB) => {
      for (const s of subscriptionsInDB) {
        const subscriptionRecipient = {
          endpoint: s.dataValues.endpoint,
          expirationTime: s.dataValues.expirationTime,
          keys: JSON.parse(s.dataValues.keys),
        };
        const title = req.body.title;
        const description = req.body.description;
        sendNotification(subscriptionRecipient, title, description);
      }
      res.send('Notification sent');
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error happened',
      });
    });
};

exports.findOne = (req, res) => {

  if (!req.params.endpoint || typeof req.params.endpoint !== 'string') {
    return res.status(400).send({ message: 'Endpoint is required and must be a string' });
  }

  Subscription.findOne({
    where: {
      endpoint: req.params.endpoint,
    },
  })
    .then((subscription) => {
      if (!subscription) {
        return res.status(404).send({ message: 'Subscription not found' });
      }
      res.send(subscription);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error happened',
      });
    });
};

exports.update = (req, res) => {

  if (!req.params.endpoint || typeof req.params.endpoint !== 'string') {
    return res.status(400).send({ message: 'Endpoint is required and must be a string' });
  }

  if (!req.body.subscription || typeof req.body.subscription !== 'object') {
    return res.status(400).send({ message: 'Subscription object is required' });
  }

  if (req.body.subscription.endpoint && typeof req.body.subscription.endpoint !== 'string') {
    return res.status(400).send({ message: 'Endpoint must be a string' });
  }

  if (req.body.subscription.expirationTime && typeof req.body.subscription.expirationTime !== 'string') {
    return res.status(400).send({ message: 'Expiration time must be a string' });
  }

  if (req.body.subscription.keys && typeof req.body.subscription.keys !== 'object') {
    return res.status(400).send({ message: 'Keys must be an object' });
  }

  if (req.body.subscriptionName && typeof req.body.subscriptionName !== 'string') {
    return res.status(400).send({ message: 'Subscription name must be a string' });
  }

  const updateData = {
    endpoint: req.body.subscription.endpoint,
    expirationTime: req.body.subscription.expirationTime,
    keys: req.body.subscription.keys ? JSON.stringify(req.body.subscription.keys) : undefined,
    subscriptionName: req.body.subscriptionName,
  };

  // Erase undefined fields as to not update them
  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

  Subscription.findOne({
    where: {
      endpoint: req.params.endpoint,
    },
  })
    .then((subscription) => {
      if (!subscription) {
        return res.status(404).send({ message: 'Subscription not found' });
      }

      subscription.update(updateData)
        .then((updatedSubscription) => {
          res.send(updatedSubscription);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error happened',
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error happened',
      });
    });
};

exports.deleteByEndpoint = (req, res) => {

  if (!req.body.endpoint || typeof req.body.endpoint !== 'string') {
    return res.status(400).send({ message: 'Endpoint is required and must be a string' });
  }

  Subscription.findOne({
    where: {
      endpoint: req.body.endpoint,
    },
  })
    .then((subscriptionToDelete) => {
      if (!subscriptionToDelete) {
        res.send('Endpoint not found');
        return;
      }

      Subscription.destroy({
        where: {
          id: subscriptionToDelete.id,
        },
      })
        .then(() => {
          Subscription.findAll()
            .then((subscriptionsInDB) => {
              for (let s of subscriptionsInDB) {
                const subscriptionRecipient = {
                  endpoint: s.dataValues.endpoint,
                  expirationTime: s.dataValues.expirationTime,
                  keys: JSON.parse(s.dataValues.keys),
                };
                const title = `Subscription to ${subscriptionToDelete.subscriptionName} deleted`;
                const description = '';
                sendNotification(subscriptionRecipient, title, description);
              }
              res.status(200).send('Subscription deleted');
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || 'Some error happened',
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error happened',
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error happened',
      });
    });
};

const sendNotification = async (subscriptionRecipient, title, description) => {
  const options = {
    vapidDetails: {
      subject: 'mailto:miguelangelgutierrezcarreno@alumno.ieselrincon.es',
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
    },
  };
  try {
    await webPush.sendNotification(
      subscriptionRecipient,
      JSON.stringify({
        title,
        description,
        image: 'images/lockerApp-new.png',
      }),
      options
    );
  } catch (error) {
    throw (error);
  }
}