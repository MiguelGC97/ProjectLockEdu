const db = require("../models");

const User = db.user;

const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

exports.index = (req, res) => {
    findAll(req, res);
};

const findAll = (req, res) => {
    Locker.findAll().then((data) => {
        console.log(data);
        return res.render("partials/userbar", { user: data });
    });
};
