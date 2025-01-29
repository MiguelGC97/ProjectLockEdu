require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const db = require("./models");


app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check JWT token
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  if (!token) return next();

  if (req.headers.authorization.indexOf('Basic ') === 0) {
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    req.body.username = username;
    req.body.password = password;
    return next();
  }

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    } else {
      req.user = user;
      req.token = token;
      next();
    }
  });
});

// Routes
require("./routes/locker.routes")(app);
require("./routes/box.routes")(app);
require("./routes/user.routes")(app);
require("./routes/type.routes")(app);
require("./routes/item.routes")(app);
require("./routes/booking.routes")(app);
require("./routes/report.routes")(app);

require("./routes/reportLog.routes")(app);

require("./routes/reportLog.views.routes")(app);


require("./routes/locker.views.routes")(app);

// Function to run seeders
async function runSeeders() {
  const seeders = [
    require('./seeders/20241121192833-seed-lockers.js'),
    require('./seeders/20241121192910-seed-boxes.js'),
    require('./seeders/20241121192926-seed-types.js'),
    require('./seeders/20241121192941-seed-items.js'),
    require('./seeders/20241121162756-seed-user.js'),
    require('./seeders/20241121163651-seed-report.js'),
    require('./seeders/20241210162620-seed-bookings.js'),
    require('./seeders/20241210162620-seed-notifications.js'),
    require('./seeders/20250114162620-seed-reportLog.js'),
  ];

  console.log("Running seeders...");
  for (const seeder of seeders) {
    await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
  }
  console.log("Seeders completed.");
}

// Sync database and start server
db.sequelize.sync({ force: true }).then(async () => {
  console.log("Database synced: tables dropped and recreated.");

  await runSeeders(); // Run seeders after syncing database


  const PORT = process.env.DB_PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch((error) => {
  console.error("Error syncing database:", error);
});
