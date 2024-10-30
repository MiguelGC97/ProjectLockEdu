// const Sequelize = require("sequelize");
// const env = require("dotenv");
// env.config();

// const DB_HOST = process.env.DB_HOST;
// const DB_DATABASE = process.env.DB_DATABASE;
// const DB_USERNAME = process.env.DB_USERNAME;
// const DB_PASSWORD = process.env.DB_PASSWORD;

// const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
//   dialect: "mysql",
//   host: DB_HOST,
// });

// module.exports = sequelize;




require("dotenv").config(); // Cargar las variables de entorno desde el archivo .env
const { Sequelize } = require("sequelize"); // Importar Sequelize


const sequelize = new Sequelize(
    process.env.DB_NAME, // Nombre de la base de datos
    process.env.DB_USER, // Usuario de la base de datos
    process.env.DB_PASSWORD, // Contraseña del usuario
    {
        host: process.env.DB_HOST, // Host de la base de datos
        dialect: "mysql", // Tipo de base de datos
    }
);


sequelize.authenticate()
    .then(() => {
        console.log("Conexión a la base de datos establecida con éxito.");
    })
    .catch(err => {
        console.error("No se pudo conectar a la base de datos:", err);
    });

// Exportar la instancia de Sequelize
module.exports = sequelize;
