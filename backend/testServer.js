require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const http = require('http');
const WebSocket = require('ws');

const TESTPORT = process.env.HOST_PORT_TEST || 8081;


const { store } = require('./controllers/reportLog.views.controller.js');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require("./models/index.js");


const app = express();


app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


const sessionStore = new sequelizeStore({
  db: db.sequelize,
});
db.sessionStore = sessionStore;
db.session = session;


app.use(
  db.session({
    secret: process.env.SESSION_SECRET,
    store: db.sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

const authSession = require("./middlewares/auth.session.js");
app.use(authSession.setUserLocals);


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


const routes = [
  'locker', 'box', 'user', 'type', 'item', 'booking',
  'report', 'reportLog', 'reportLog.views', 'user.views', 'locker.views',
  'notification.views'
];


routes.forEach(route => require(`./routes/${route}.routes.js`)(app));


const server = http.createServer(app);


const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected.');


  ws.send(JSON.stringify({ message: 'Bienvenido al servidor WebSocket.' }));


  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);


    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });


  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });


  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});




server.listen(TESTPORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${TESTPORT}.`);
});

module.exports = { app, server };
