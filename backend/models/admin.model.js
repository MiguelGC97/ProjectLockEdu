module.exports = (sequelize, DataTypes) => {
  return sequelize.define("admin", {}, { timestamps: false });
};
