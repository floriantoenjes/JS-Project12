"use strict";

const express = require("express");
const jwt = require("express-jwt");

const Soundtrack = require("../models/soundtrack");
const User = require("../models/user");

const router = express.Router();

const auth = jwt({
    secret: process.env.SECRET,
    userProperty: "payload"
});

router.get("/", auth, function (req, res, next) {
    const userId = req.payload._id;
    User.findById(userId).populate("favorites").exec(function (error, user) {
        if (error) {
            return next(error);
        }
        if (user && user.favorites) {
            return res.send(user.favorites);
        }
    });
});

router.post("/", auth, function (req, res, next) {
    Soundtrack.findById(req.body.id, function (error, soundtrack) {
        if (error) {
            return next(error);
        } else if (!soundtrack) {
            soundtrack = new Soundtrack({
                _id: req.body.id,
                name: req.body.name,
                href: req.body.external_urls.spotify,
                imageUrl: req.body.images[2].url
            });
            soundtrack.save(function (error, soundtrack) {
                if (error) {
                    console.log(error);
                    return next(error);
                }
            });
        }

        const userId = req.payload._id;

        User.update({_id: userId}, {$addToSet: {favorites: soundtrack._id}}, function (error, updatedUser) {
            if (error) {
                console.log(error);
                return next(error);
            } // ToDo: Add handling if user is not found
            return res.json(updatedUser);
        });
    });
});

router.delete("/:id", auth, function (req, res, next) {

    Soundtrack.findById(req.params.id, function (error, soundtrack) {
        if (error) {
            return next(error);
        } else if (!soundtrack) {
            return next();
        }

        const userId = req.payload._id;

        User.update({_id: userId}, {$pull: {favorites: soundtrack._id}}, function (error, result) {
            if (error) {
                return next(error);
            } if (!result) {
                res.status(404);
                return res.send();
            }
            res.status(204);
            return res.send();
        });
    });

});

router.get("/users/:userId", auth, function (req, res, next) {
    User.findOne({_id: req.params.userId}).populate("favorites").exec(function (error, user) {
        if (error) {
            return next(error);
        } else if (!user) {
            return next();
        } else if (!user.favorites) {
            res.status(404);
            return res.send();
        }
        if (user && user.favorites) {
            return res.json(user.favorites);
        }
    });
});


module.exports = router;
