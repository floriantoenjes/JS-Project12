"use strict";

const auth = require("../auth");
const express = require("express");
const https = require("https");
const request = require("request");

const router = express.Router();

router.get("/search/:query", auth, function (req, res, next) {
    console.log("IN");
    doPOSTRequest("https://accounts.spotify.com/api/token",
        {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + (new Buffer(process.env.CLIENT_KEY + ":" + process.env.CLIENT_SECRET)
                .toString("base64"))
        }, {
            grant_type: "client_credentials"
        }, function (access_token) {

            doGETRequest(`https://www.omdbapi.com/?t=${req.params.query}&apikey=${process.env.OMDBKEY}`, {},
                function (response) {
                    const movie = JSON.parse(response);
                    if (movie.Error === "Movie not found!") {
                        const error = new Error(movie.Error);
                        error.status = 404;
                        return next(error);
                    }


                    doGETRequest(`https://api.spotify.com/v1/search?q=${movie.Title}&type=album&limit=5&offset=0`, {
                        "Authorization": `Bearer ${access_token}`
                    }, function (response) {
                        const albums = JSON.parse(response);
                        return res.json({
                            movie: movie,
                            soundtracks: albums
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

    request.post(options, function (err, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            const json = JSON.parse(body);
            callback(json.access_token);
        } else {
            return next(err);
        }
    });
}

function doGETRequest(url, headers, callback) {
    const options = {
        url: url,
        headers: headers
    };

    request.get(options, function (err, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            callback(body);
        } else {
            return next(err);
        }
    });
}

module.exports = router;
