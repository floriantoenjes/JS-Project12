"use strict";

const express = require("express");
const https = require("https");
const router = express.Router();
const config = require("../config");

router.get("/:query", function (req, res, next) {

    doGETRequest(`https://www.omdbapi.com/?t=${req.params.query}&apikey=${config.omdbKey}`, (error, movie) => {
        if (error) {
            return next(error);
        } else if (movie.Response === "False") {
            return next();
        }

        doGETRequest(`https://api.spotify.com/v1/search?q=${movie.Title}&type=album&limit=5&offset=0`, (error, soundtracks) => {
            if (error) {
                return next(error);
            }

            res.json({
                movie: movie,
                soundtracks: soundtracks
            });
        });

    });
});

function doGETRequest(url, callback) {
    const request = https.get(url, (response) => {
        if (response.statusCode == 200) {
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
