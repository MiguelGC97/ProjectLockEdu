require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// const port = process.env.PORT || 4000;
const db = require("./models");

// const cors = require('cors'); // Si decides usar CORS, descomenta esta línea

// const sequelize = require("./config/config.js");


app.get("/", (req, res) => {
  res.json({ message: "Welcome to locker app." });
});

// app.use(cors()); // Si decides usar CORS, descomenta esta línea

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.

app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["authorization"];
  if (!token) return next(); //if no token, continue

  if (req.headers.authorization.indexOf("Basic ") === 0) {
    // verify auth basic credentials
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    req.body.username = username;
    req.body.password = password;

    return next();
  }

  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      req.token = token;
      next();
    }
  });
});

require("./routes/locker.routes")(app);
require("./routes/box.routes")(app);
require("./routes/user.routes")(app);
require("./routes/report.routes")(app);
require("./routes/teacher.routes")(app);
require("./routes/incidentManager.routes")(app);
require("./routes/admin.routes")(app);

// Function to run seeders

async function runSeeders() {
  const seeders = [
    // require("./seeders/20241121192833-seed-lockers.js"),
    // require("./seeders/20241121192910-seed-boxes.js"),
    // require("./seeders/20241121192926-seed-types.js"),
    // require("./seeders/20241121192941-seed-items.js"),
    require("./seeders/20241121162756-seed-user.js"),
    require("./seeders/20241121163651-seed-report.js"),
  ];

  console.log("Running seeders...");
  for (const seeder of seeders) {
    await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
  }
  console.log("Seeders completed.");
}

// Sync database and start server

db.sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("Database synced: tables dropped and recreated.");

    await runSeeders(); // Run seeders after syncing database

    const PORT = process.env.DB_PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
