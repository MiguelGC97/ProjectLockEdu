const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB_DATABASE, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
    host: dbConfig.DB_HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,

    pool: {
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.acquire,
        idle: dbConfig.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.locker = require("./locker.model.js")(sequelize, Sequelize);

// db.box = require("./box.model.js")(sequelize, Sequelize);

// db.user = require("./user.model.js")(sequelize, Sequelize);

// db.user = require("./object.model.js")(sequelize, Sequelize);

module.exports = db;