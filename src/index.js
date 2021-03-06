"use strict";

require("dotenv").config({path: "./src/.env"});

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");

const path = require("path");
const kinofyRoutes = require("./routes/kinofy");
const favoriteRoutes = require("./routes/favorites");
const userRoutes = require("./routes/users");

const app = express();


// Db setup
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/kinofy");
const db = mongoose.connection;

db.on("error", function (error) {
    console.error("Connection error:", error);
});

db.on("open", function () {
    console.log("Database connection successful");
});


// App settings
app.set("port", process.env.PORT || 5000);


// Setup middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Serve public files
app.use("/", express.static("public"));


// Vendor scripts
app.get("/vendor/angular.js", function (req, res) {
    res.sendFile(path.join(__dirname, "../node_modules", "angular", "angular.js"));
});

app.get("/vendor/angular-route.js", function (req, res) {
    res.sendFile(path.join(__dirname, "../node_modules", "angular-route", "angular-route.js"));
});


// Setup routes
app.use("/api/v1/kinofy", kinofyRoutes);
app.use("/api/v1/kinofy/favorites", favoriteRoutes);
app.use("/api/v1/users", userRoutes);

app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.send(error);
});


// Start the server
const server = app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + server.address().port);
});

module.exports = server;
