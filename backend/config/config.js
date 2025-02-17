require("dotenv").config();

const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    username: process.env.DB_USERNAME_DEV || "default_user",
    password: process.env.DB_PASSWORD_DEV || "default_password",
    database: process.env.DB_DATABASE_DEV || "default_db",
    host: process.env.DB_HOST_DEV || "localhost",
    dialect: process.env.DB_DIALECT_DEV || "mysql",
    port: process.env.DB_PORT_DEV || 3306,
    logging: console.log,
  },
  test: {
    username: process.env.DB_USERNAME_TEST || "test_user",
    password: process.env.DB_PASSWORD_TEST || "test_pass",
    database: process.env.DB_DATABASE_TEST || "test_db",
    host: process.env.DB_HOST_TEST || "localhost",
    dialect: process.env.DB_DIALECT_TEST || "mysql",
    port: process.env.DB_PORT_TEST || 3307,
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME_PROD || "prod_user",
    password: process.env.DB_PASSWORD_PROD || "prod_secure_pass",
    database: process.env.DB_DATABASE_PROD || "prod_db",
    host: process.env.DB_HOST_PROD || "prod-db-server",
    dialect: process.env.DB_DIALECT_PROD || "mysql",
    port: process.env.DB_PORT_PROD || 3306,
    logging: false,
  }
};


module.exports = config[env];
