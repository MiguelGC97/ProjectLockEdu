// import 'dotenv/config'
// import 'express'

// const dotenv = require('dotenv');
// const express = require('express');



const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db.config'); 
const User = require('./models/user.model'); 


dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sincronizar los modelos y crear tablas si no existen
sequelize.sync()
    .then(() => {
        console.log("Las tablas han sido sincronizadas con la base de datos.");
    })
    .catch(err => {
        console.error("Error al sincronizar las tablas:", err);
    });

// Inicializar el servidor
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server online on port http://localhost:${port}`);
});
