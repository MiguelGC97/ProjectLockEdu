require('dotenv').config();
 
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;
const db = require("./models");
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));


// const cors = require('cors'); // Si decides usar CORS, descomenta esta línea

// const sequelize = require("./config/config.js");


db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop a re-sync db.");
});

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
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  if(req.headers.authorization.indexOf('Basic ') === 0){
    // verify auth basic credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
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
        message: "Invalid user."
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


const PORT = process.env.DB_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
