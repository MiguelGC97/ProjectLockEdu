
var jwt = require("jsonwebtoken");


function generateToken(user) {

  if (!user) return null;

  var u = {
    id: user.id,
    name: user.name,
    username: user.username,
    surname: user.surname,
    password: user.password,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };


  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });
}


function formatDate(report) {

  if (!report.createdAt || typeof createdAt !== 'string') {
    throw new Error("Not a valid format.");
  }


  const isoDate = (report.createdAt).replace(" ", "T");


  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    throw new Error("Date Invalid");
  }


  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleString('es-ES', options);
}



function generateTokenReport(report) {
  if (!report) return null;

  var r = {
    id: report.id,
    content: report.content,
    isSolved: report.isSolved,
  };

  return jwt.sign(r, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });
}


function getCleanUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    surname: user.surname,
    password: user.password,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}

function getCleanReport(report) {
  if (!report) return null;

  return {
    id: report.id,
    content: report.content,
    isSolved: report.isSolved,
  };
}

function limitDate(date) {
  const newDate = new Date(date.replace(" ", "T"));
  newDate.setMinutes(newDate.getMinutes() + 10);

  return newDate;
}

function canUpdate(newDate) {
  const now = new Date();

  if (now <= newDate) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  generateToken,
  getCleanUser,
  getCleanReport,
  limitDate,
  canUpdate,
  generateTokenReport,
  formatDate,
};
