// Importar dependencias
const express = require("express");
const bodyParser = require("body-parser");
// const cors = require('cors'); // Si decides usar CORS, descomenta esta línea
const dotenv = require("dotenv");
const sequelize = require("./config/db.config");
const User = require("./models/user.model");
const userController = require("./controllers/user.controller"); // Asegúrate de tener este archivo

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Middleware
// app.use(cors()); // Si decides usar CORS, descomenta esta línea
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop a re-sync db.");
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to locker app." });
});

require("./routes/locker.routes")(app);
require("./routes/box.routes")(app);


const PORT = process.env.DB_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
