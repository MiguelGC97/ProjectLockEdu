module.exports = (sequelize, DataTypes) => {
  return sequelize.define("incidentManager", {}, { timestamps: false });
};
