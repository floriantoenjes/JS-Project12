const express = require("express");
const http = require("http");
const router = express.Router();


router.get("/:query", function (req, res, next) {

    const request = http.get(`http://www.omdbapi.com/?t=${req.params.query}&apikey=36f3d30d`, (response) => {
        if (response.statusCode == 200) {
            let rawdata = "";
            response.on("data", (chunk) => {
                rawdata += chunk;
            });
            response.on("end", () => {
                try {
                    let result = JSON.parse(rawdata);
                    console.log(result);
                } catch (error) {
                    return next(error);
                }
            });
        } else {
            const error = new Error("There was an error fetching data from OMDb");
            error.status = response.statusCode;
            return next(error);
        }
    });
    request.on("error", (error) => {
        return next(error);
    });

    res.send("Hello World!");
});

module.exports = router;
