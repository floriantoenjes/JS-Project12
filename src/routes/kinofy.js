"use strict";

const auth = require("../auth");
const express = require("express");
const https = require("https");
const request = require("request");
const querystring = require("querystring");

const router = express.Router();

router.get("/search/:query", auth, function (req, res, next) {
    console.log("IN");
    getToken(function (access_token) {



        doGETRequest("https://api.spotify.com/v1/search?q=${movie.Title}&type=album&limit=5&offset=0", {
            "Authorization": `Bearer ${access_token}`
        }, function (albums) {
            res.send();
        });


        // doGETRequest(`https://www.omdbapi.com/?t=${req.params.query}&apikey=${process.env.OMDBKEY}`, (error, movie) => {
        //     if (error) {
        //         return next(error);
        //     } else if (movie.Response === "False") {
        //         return next();
        //     }
        //
        //     doGETRequest(`https://api.spotify.com/v1/search?q=${movie.Title}&type=album&limit=5&offset=0`, (error, soundtracks) => {
        //         if (error) {
        //             return next(error);
        //         }
        //
        //         return res.json({
        //             movie: movie,
        //             soundtracks: soundtracks
        //         });
        //     });
        //
        // });

        res.send();
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
            const json = JSON.parse(body);
            console.log(json.access_token);
            callback(json.access_token);
        } else {
            console.log("error");
            console.log(body);
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
            console.log(body);
            callback(body);
        } else {
            console.log(body);
        }
    });
}

module.exports = router;
