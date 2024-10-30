// Importar dependencias
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors'); // Si decides usar CORS, descomenta esta línea
const dotenv = require('dotenv');
const sequelize = require('./config/db.config'); 
const User = require('./models/user.model'); 
const userController = require('./controllers/user.controller'); // Asegúrate de tener este archivo

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Middleware
// app.use(cors()); // Si decides usar CORS, descomenta esta línea
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definición de rutas
app.get('/api/users', userController.getAll);        
app.get('/api/users/:username', userController.getByUsername); 
app.post('/api/users', userController.addNewUser);     
app.delete('/api/users', userController.delete);      

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
