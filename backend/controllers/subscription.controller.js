const db = require("../models");
const Subscription = db.subscription;
const { Op } = require("sequelize");

const webPush = require('web-push');

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

exports.create = async (req, res) => {  // <- Asegúrate de que la función es async
  try {
    if (!req.body.endpoint || typeof req.body.endpoint !== 'string') {
      return res.status(400).send({ message: 'Endpoint is required and must be a string' });
    }

    if (req.body.expirationTime && typeof req.body.expirationTime !== 'string') {
      return res.status(400).send({ message: 'Expiration time must be a string' });
    }

    if (!req.body.keys || typeof req.body.keys !== 'object') {
      return res.status(400).send({ message: 'Keys are required and must be an object' });
    }

    if (!req.body.keys.auth || typeof req.body.keys.auth !== 'string' || Buffer.from(req.body.keys.auth, 'base64').length < 16) {
      return res.status(400).send({ message: 'Subscription auth key is required, must be a string, and at least 16 bytes long' });
    }

    if (!req.body.subscriptionName || typeof req.body.subscriptionName !== 'string') {
      return res.status(400).send({ message: 'Subscription name is required and must be a string' });
    }

    if (!req.user.id || typeof req.user.id !== 'number') {
      return res.status(400).send({ message: 'User ID is required and must be a number' });
    }

    const existingSubscription = await Subscription.findOne({
      where: { subscriptionName: req.body.subscriptionName, userId: req.user.id }
    });

    if (existingSubscription) {
      return res.status(400).send({ message: 'A subscription with this name already exists' });
    }

    const subscription = await Subscription.create({
      endpoint: req.body.endpoint,
      expirationTime: req.body.expirationTime,
      keys: JSON.stringify(req.body.keys),
      subscriptionName: req.body.subscriptionName,
      userId: req.user.id,
    });

    const subscriptionsInDB = await Subscription.findAll();

    for (let s of subscriptionsInDB) {
      const subscriptionRecipient = {
        endpoint: s.dataValues.endpoint,
        expirationTime: s.dataValues.expirationTime,
        keys: JSON.parse(s.dataValues.keys),
      };

      const title = `New Subscription`;
      const description = `${subscription.subscriptionName} is now subscribed`;
    }

    res.status(201).send(subscription);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error happened',
    });
  }
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
        // sendNotification(subscriptionRecipient, title, description);
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

  if (!req.user.id|| typeof req.user.id !== 'number') {
    return res.status(400).send({ message: 'User ID is required and must be a number' });
  }

  const userId = req.user.id;

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
        // sendNotification(subscriptionRecipient, title, description);
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

  if (!req.body.endpoint || typeof req.body.endpoint !== 'string') {
    return res.status(400).send({ message: 'Endpoint is required and must be a string' });
  }

  Subscription.findOne({
    where: {
      endpoint: req.body.endpoint,
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

  if (!req.body.endpoint || typeof req.body.endpoint !== 'string') {
    return res.status(400).send({ message: 'Endpoint is required and must be a string' });
  }

  if (req.body.expirationTime && typeof req.body.expirationTime !== 'string') {
    return res.status(400).send({ message: 'Expiration time must be a string' });
  }

  if (req.body.subscriptionName && typeof req.body.subscriptionName !== 'string') {
    return res.status(400).send({ message: 'Subscription name must be a string' });
  }

  const updateData = {
    endpoint: req.body.endpoint,
    expirationTime: req.body.expirationTime,
    subscriptionName: req.body.subscriptionName,
  };

  // Erase undefined fields as to not update them
  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

  Subscription.findOne({
    where: {
      endpoint: req.body.endpoint,
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
                // sendNotification(subscriptionRecipient, title, description);
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