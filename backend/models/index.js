const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const db = {};

let sequelize;

try {
  if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
  } else {
    sequelize = new Sequelize(
      dbConfig.DB,
      dbConfig.USER,
      dbConfig.PASSWORD,
      dbConfig
    );
  }
} catch (error) {
  console.error("Error Sequelize is not able to iniciate:", error.message);
  process.exit(1);
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

db.locker = require("./locker.model.js")(sequelize, Sequelize);
db.box = require("./box.model.js")(sequelize, Sequelize);
// db.type = require("./type.model.js")(sequelize, Sequelize);
// db.item = require("./item.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.report = require("./report.model.js")(sequelize, Sequelize);

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
