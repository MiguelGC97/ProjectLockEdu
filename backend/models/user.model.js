const { DataTypes, ENUM } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("TEACHER", "ADMIN", "MANAGER"),
      allowNull: false,
    },
  });

  return User;
};

//DR3AM-- HAY QUE CREAR LA LOGICA DE CUANDO SE CREA UN USUARIO SI TIENE UN ROL EN CONCRETO TAMBIEN DEBE CREARSE EN SU TABLA CORRESPONDIENTE? PREGUNTAR A TIBU