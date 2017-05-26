"use strict";

const express = require("express");
const jwt = require("express-jwt")
const router = express.Router();

const User = require("../models/user");

const auth = jwt({
    secret: process.env.SECRET,
    userProperty: "user"
});

router.get("/", auth, function (req, res, next) {
    User.find({}, "email", function (error, users) {
        if (error) {
            return next(error);
        } else if (!users) {
            return next();
        }
        res.json(users);
    })
});

router.get("/:userId", auth, function (req, res, next) {
    User.findOne({_id: req.params.userId}).populate("favorites").exec(function (error, user) {
        if (error) {
            return next(error);
        } else if (!user) {
            return next();
        } else if (!user.favorites) {
            res.status(404);
            return res.send();
        }
        return res.json(user);
    });
});

router.post("/register", function (req, res, next) {
    const user = new User(req.body);
    user.save(function (error, user) {
        if (error) {
            console.log(error);
            error.status = 400;
            return next(error);
        }
        const token = user.generateJwt();
        res.status(201);
        return res.json({
            token: token
        });
    })
});

router.post("/login", function (req, res, next) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
        if (error) {
            return next(error);
        } else if (!user) {
            res.status(401);
            return res.send();
        }
        return res.json({
            "token": user.generateJwt()
        });
    });
});

module.exports = router;