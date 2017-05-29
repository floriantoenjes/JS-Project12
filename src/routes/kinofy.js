"use strict";

const auth = require("../auth");
const express = require("express");
const https = require("https");
const request = require("request");
const querystring = require("querystring");

const router = express.Router();

router.get("/search/:query", auth, function (req, res, next) {
    console.log("IN");
    getToken(function (body) {


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
});

function getToken(callback) {
    // ToDo: Remove log statements and unused modules
    console.log("in");

    const options = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic YmUxYTM0NDJiZTNlNGVjNzg1ODBmMzNiZGI5YTAwODk6MzgzZjQ1M2I2M2YwNDYxOWIxNjQ3NTE1OWFjNWQ4OGY="
        },
        form: {
            grant_type: "client_credentials"
        }
    };

    request.post(options, function (err, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            console.log(body);
            callback(body);
        } else {
            console.log("error");
            console.log(body);
        }
    });
}

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
