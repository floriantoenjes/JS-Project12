const express = require("express");
const http = require("http");
const router = express.Router();


router.get("/:query", function (req, res, next) {

    doGETRequest(`http://www.omdbapi.com/?t=${req.params.query}&apikey=36f3d30d`, function (error, result) {
        console.log(result);
    });

    res.send("Hello World!");
});

function doGETRequest(url, callback) {
    const request = http.get(url, (response) => {
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
            const error = new Error("There was an error doing a GET request");
            error.status = response.statusCode;
            callback(error);
        }
    });
    request.on("error", (error) => {
        callback(error);
    });
}

module.exports = router;
