"use strict";

const jwt = require("express-jwt");

module.exports = jwt({
    secret: process.env.SECRET,
    userProperty: "user"
});