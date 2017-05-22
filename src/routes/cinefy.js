const express = require("express");
const https = require("https");
const router = express.Router();


router.get("/:query", function (req, res, next) {

    doGETRequest(`https://www.omdbapi.com/?t=${req.params.query}&apikey=36f3d30d`, function (error, movie) {
        if (error) {
            next(error);
        }

        doGETRequest(`https://api.spotify.com/v1/search?q=${movie.Title}&type=album`, function (error, soundtrack) {
            if (error) {
                next(error);
            }

            res.json(soundtrack);
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
            const error = new Error("There was an error doing an HTTPS GET request");
            error.status = response.statusCode;
            callback(error);
        }
    });
    request.on("error", (error) => {
        callback(error);
    });
}

module.exports = router;
