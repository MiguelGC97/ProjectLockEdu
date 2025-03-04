require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const http = require("http");
const WebSocket = require("ws");
const fs = require('fs');
const path = require('path');


const { store } = require("./controllers/reportLog.views.controller.js");
const sequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./models/index.js");

const app = express();


const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const uploadsDir = path.resolve(__dirname, 'public/uploads');

const clearUploadsFolder = () => {
  if (fs.existsSync(uploadsDir)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error deleting files from uploads:', err);
    }
  }
};

process.on('SIGINT', async () => {
  console.log('\nShutting down server... Cleaning up uploads folder.');
  clearUploadsFolder();
  setTimeout(() => process.exit(), 1000);
});

process.on('SIGTERM', async () => {
  console.log('\nServer is shutting down... Cleaning up uploads folder.');
  clearUploadsFolder();
  setTimeout(() => process.exit(), 1000);
});

const sessionStore = new sequelizeStore({
  db: db.sequelize,
});

db.sessionStore = sessionStore;
db.session = session;


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
}));


const authSession = require("./middlewares/authForReact.session.js");
app.use(authSession.setUserLocals);

app.use((req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) return next();

  if (token.startsWith("Basic ")) {
    const base64Credentials = token.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");
    req.body.username = username;
    req.body.password = password;
    return next();
  }

  token = token.replace("Bearer ", "");
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
  "locker",
  "box",
  "user",
  "type",
  "item",
  "booking",
  "report",
  "reportLog",
  "reportLog.views",
  "user.views",
  "locker.views",
  "notification.views"
];

routes.forEach((route) => require(`./routes/${route}.routes.js`)(app));

async function runSeeders() {
  const seeders = [
    require("./seeders/01-20241121192833-seed-lockers.js"),
    require("./seeders/02-20241121192910-seed-boxes.js"),
    require("./seeders/06-20241121192926-seed-types.js"),
    require("./seeders/08-20241121192941-seed-items.js"),
    require("./seeders/00-20241121162756-seed-user.js"),
    require("./seeders/03-20241121163651-seed-report.js"),
    require("./seeders/04-20241210162620-seed-bookings.js"),
    require("./seeders/05-20241121192926-seed-notifications.js"),
    require("./seeders/09-20250114162620-seed-reportLog.js"),
    require("./seeders/07-20241121192927-seed-settings.js"),
  ];

  for (const seeder of seeders) {
    await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
  }
}


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ message: "Bienvenido al servidor WebSocket." }));

  ws.on("message", (message) => {

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => console.log("Cliente desconectado."));
  ws.on("error", (error) => console.error("WebSocket error:", error));
});


app.set("wss", wss);


db.sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("Database synced: tables dropped and recreated.");

    await runSeeders();
    await db.sessionStore.sync();

    const PORT = process.env.HOST_PORT || 8080;
    server.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}.`);
      console.log(`Servidor WebSocket ejecutándose en el puerto ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
