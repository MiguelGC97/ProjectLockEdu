const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     operatorAliases: false,

//     pool: dbConfig.pool
// });

const db = {};


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.locker = require("./locker.model.js")(sequelize, Sequelize);
db.box = require("./box.model.js")(sequelize, Sequelize);
// db.type = require("./type.model.js")(sequelize, Sequelize);
// db.item = require("./item.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

// Locker.hasMany(Box);
// Box.belongsTo(Locker);

//Box.hasMany(Item);
//Item.belongsTo(Box);

//Box.hasMany(Incident);
//Incident.belongsTo(Box);

//Type.hasMany(Item);
//Item.belongsTo(Type);

//User.hasMany(Incident);
//Incident.belongsTo(User);

//User.hasMany(Booking);
//Booking.belongsTo(User);

//Item.belongsToMany(Booking, { through: 'ItemBookings' /* options */ });
//Booking.belongsToMany(Item, { through: 'ItemBookings' /* options */ });

//User.belongsToMany(Incident, { thorugh: 'UserIncidents' /* options */ });
//Incident.belongsToMany(User, { thorugh: 'UserIncidents' /* options */ });

module.exports = db;