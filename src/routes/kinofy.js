"use strict";

const auth = require("../auth");
const express = require("express");
const https = require("https");
const request = require("request");

const router = express.Router();

router.get("/search/:query", auth, function (req, res, next) {
    doGETRequest(`https://www.omdbapi.com/?t=${req.params.query}&apikey=${process.env.OMDBKEY}`, {},
        function (error, movie) {
            if (error) {
                return next(error);
            }
            if (movie.Error === "Movie not found!") {
                const error = new Error(movie.Error);
                error.status = 404;
                return next(error);
            }


            const spotifyCredentials = (new Buffer(process.env.CLIENT_KEY + ":" + process.env.CLIENT_SECRET).toString("base64"));

            doPOSTRequest("https://accounts.spotify.com/api/token",
                {
                    "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Basic " + spotifyCredentials
                },
                {
                    grant_type: "client_credentials"
                }, function (error, access_token) {
                    if (error) {
                        return next(error);
                    }

                    doGETRequest(`https://api.spotify.com/v1/search?q=${movie.Title}&type=album&limit=5&offset=0`, {
                        "Authorization": `Bearer ${access_token}`
                    }, function (error, soundtracks) {
                        if (error) {
                            return next(error);
                        }
                        return res.json({
                            movie: movie,
                            soundtracks: soundtracks
                        })
                    });
                });
        });
});

function doPOSTRequest(url, headers, form, callback) {

    const options = {
        url: url,
        headers: headers,
        form: form
    };

    request.post(options, function (error, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            const json = JSON.parse(body);
            callback(null, json.access_token);
        } else {
            return callback(error);
        }
    });
}

function doGETRequest(url, headers, callback) {
    const options = {
        url: url,
        headers: headers
    };

    request.get(options, function (error, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            callback(null, JSON.parse(body));
        } else {
            return callback(error);
        }
    });
}

module.exports = router;
