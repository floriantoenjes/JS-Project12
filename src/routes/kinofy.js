"use strict";

const express = require("express");
const https = require("https");
const jwt = require("express-jwt");

const Soundtrack = require("../models/soundtrack");
const User = require("../models/user");

const router = express.Router();

const auth = jwt({
    secret: process.env.SECRET,
    userProperty: "payload"
});

router.get("/search/:query", auth, function (req, res, next) {
    console.log("Payload", req.payload);

    doGETRequest(`https://www.omdbapi.com/?t=${req.params.query}&apikey=${process.env.OMDBKEY}`, (error, movie) => {
        if (error) {
            return next(error);
        } else if (movie.Response === "False") {
            return next();
        }

        doGETRequest(`https://api.spotify.com/v1/search?q=${movie.Title}&type=album&limit=5&offset=0`, (error, soundtracks) => {
            if (error) {
                return next(error);
            }

            return res.json({
                movie: movie,
                soundtracks: soundtracks
            });
        });

    });
});

router.post("/favorites/", auth, function (req, res, next) {
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
        console.log("UserId", userId);

        User.update({_id: userId}, {$addToSet: {favorites: soundtrack._id}}, function (error, updatedUser) {
            if (error) {
                return next(error);
            } // ToDo: Add handling if user is not found
            return res.json(updatedUser);
        });
    });
});

router.delete("/favorites/:id", auth, function (req, res, next) {

    Soundtrack.findById(req.params.id, function (error, soundtrack) {
        if (error) {
            return next(error);
        } else if (!soundtrack) {
            return next();
        }

        const userId = req.payload.id;

        User.update({_id: userId}, {$pull: {favorites: soundtrack._id}}, function (error, updatedUser) {
            if (error) {
                return next(error);
            } // ToDo: Add handling if user is not found
            res.status(204);
            return res.send();
        });
    });

});

router.get("/favorites/", auth, function (req, res, next) {
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

function doGETRequest(url, callback) {
    const request = https.get(url, (response) => {
        if (response.statusCode === 200) {
            let rawdata = "";
            response.on("data", (chunk) => {
                rawdata += chunk;
            });
            response.on("end", () => {
                try {
                    let result = JSON.parse(rawdata);
                    callback(null, result);
                } catch (error) {
                    callback(error);
                }
            });
        } else {
            const error = new Error("There was an error doing a HTTPS GET request");
            error.status = response.statusCode;
            callback(error);
        }
    });
    request.on("error", (error) => {
        callback(error);
    });
}

module.exports = router;
