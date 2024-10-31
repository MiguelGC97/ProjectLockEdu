const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,

    pool: dbConfig.pool
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.locker = require("./locker.model.js")(sequelize, Sequelize);

db.box = require("./box.model.js")(sequelize, Sequelize);

// db.user = require("./user.model.js")(sequelize, Sequelize);

// db.user = require("./object.model.js")(sequelize, Sequelize);

module.exports = db;