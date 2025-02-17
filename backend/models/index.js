﻿const dbConfig = require("../config/config.js");
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
db.type = require("./type.model.js")(sequelize, Sequelize);
db.item = require("./item.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.booking = require("./booking.model.js")(sequelize, Sequelize);
db.report = require("./report.model.js")(sequelize, Sequelize);
db.reportLog = require("./reportLog.model.js")(sequelize, Sequelize); 

//Locker-box Association
db.locker.hasMany(db.box, {
  foreignKey: 'lockerId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
db.box.belongsTo(db.locker, {
  foreignKey: 'lockerId',
  targetKey: 'id',
});

//Type-item association
db.type.hasMany(db.item, {
  foreignKey: 'typeId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
db.item.belongsTo(db.type, {
  foreignKey: 'typeId',
  targetKey: 'id',
});

//Box-item association
db.box.hasMany(db.item, {
  foreignKey: 'boxId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
db.item.belongsTo(db.box, {
  foreignKey: 'boxId',
  targetKey: 'id',
});

//Booking-item association
db.booking.belongsToMany(db.item, {
  through: 'BookingItems',
  foreignKey: 'bookingId',
  otherKey: 'itemId',
  onDelete: 'CASCADE',
});
db.item.belongsToMany(db.booking, {
  through: 'BookingItems',
  foreignKey: 'itemId',
  otherKey: 'bookingId',
  onDelete: 'CASCADE',
});

//Booking-user association
db.user.hasMany(db.booking, {
  foreignKey: 'userId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
db.booking.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
});

// reports relations
db.report.belongsTo(db.box, {
  foreignKey: 'boxId',
  targetKey: 'id',
})

db.box.hasMany(db.report, {
  foreignKey: 'boxId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
})

db.report.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
})

db.user.hasMany(db.report, {
  foreignKey: 'userId',
  targetKey: 'id',
  onDelete: 'CASCADE',
})

// reportsLog relations 

db.reportLog.belongsTo(db.report, {
  foreignKey: 'reportId',
  targetKey: 'id',
})

db.report.hasMany(db.reportLog, {   
  foreignKey: 'reportId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
})

//reportLog belongs to user with the role of manager

db.reportLog.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
})

db.user.hasMany(db.reportLog, {   
  foreignKey: 'userId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
})

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
