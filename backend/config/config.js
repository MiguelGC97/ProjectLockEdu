require('dotenv').config();


module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: process.env.DB_DIALECT,
    PORT: process.env.DB_PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

console.log("DB Configurations:", {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: process.env.DB_DIALECT,
    PORT: process.env.DB_PORT,
});