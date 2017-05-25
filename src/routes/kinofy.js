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

router.get("/:query", auth, function (req, res, next) {
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
                href: req.body.href,
                imageUrl: req.body.images[2].url
            });
            soundtrack.save(function (error, soundtrack) {
                if (error) {
                    console.log(error);
                    return next(error);
                }
            });
        }

        User.findById(req.payload._id, function (error, user) {
            if (error) {
                return next(error);
            } else if (!user) {
                return next();
            }
            console.log("SOUNDTRACK:", soundtrack);
            user.favorites.push(soundtrack._id);
            user.email = "123@abc.de";
            user.update(function (error, user) {
                if (error) {
                    console.log(error);
                    return next(error);
                }
                return res.json(user);
            });
        });
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
