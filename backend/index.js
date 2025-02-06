require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { store } = require('./controllers/reportLog.views.controller.js');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require("./models");

// Initialize express app
const app = express();

// Middleware Configurations
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
// Public static files
app.use(express.static(path.join(__dirname, 'public')));

// Session store setup
const sessionStore = new sequelizeStore({
  db: db.sequelize,
});
db.sessionStore = sessionStore;
db.session = session;

// Session middleware
app.use(
  db.session({
    secret: process.env.SESSION_SECRET,
    store: db.sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours session
  })
);

const authSession = require("./middlewares/auth.session.js");
app.use(authSession.setUserLocals);

// JWT middleware to validate token
app.use((req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return next();

  if (token.startsWith('Basic ')) {
    const base64Credentials = token.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    req.body.username = username;
    req.body.password = password;
    return next();
  }

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/locker");
  } else {
    res.redirect("/users/login");
  }
});


// Route Imports
const routes = [
  'locker', 'box', 'user', 'type', 'item', 'booking',
  'report', 'reportLog', 'reportLog.views', 'user.views', 'locker.views'
];

routes.forEach(route => require(`./routes/${route}.routes`)(app));
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

require("./routes/notification.views.routes")(app);

require("./routes/locker.views.routes")(app);

// Seeders
async function runSeeders() {
  const seeders = [
    require('./seeders/20241121192833-seed-lockers.js'),
    require('./seeders/20241121192910-seed-boxes.js'),
    require('./seeders/20241121192926-seed-types.js'),
    require('./seeders/20241121192941-seed-items.js'),
    require('./seeders/20241121162756-seed-user.js'),
    require('./seeders/20241121163651-seed-report.js'),
    require('./seeders/20241210162620-seed-bookings.js'),
    require('./seeders/20241121192926-seed-notifications.js'),
    require('./seeders/20250114162620-seed-reportLog.js'),
  ];

  console.log("Running seeders...");
  for (const seeder of seeders) {
    await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
  }
  console.log("Seeders completed.");
}

// Sync Database and start server
db.sequelize.sync({ force: true })
  .then(async () => {
    console.log("Database synced: tables dropped and recreated.");

    await runSeeders(); // Run seeders after syncing database
    await db.sessionStore.sync(); // Sync session store

    const PORT = process.env.HOST_PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });