"use strict";

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

const cinefyRoutes = require("./routes/cinefy");
const userRoutes = require("./routes/users");


const app = express();

mongoose.connect("mongodb://localhost:27017/cinefy");
const db = mongoose.connection;

db.on("error", function (error) {
    console.error("Connection error:", error);
});

db.on("open", function () {
    console.log("Database connection successful");
});

app.set("port", process.env.PORT || 5000);

app.use(morgan("dev"));

app.use("/", express.static("public"));

// vendor scripts
app.get("/vendor/angular.js", function(req, res) {
    res.sendFile(path.join(__dirname, "../node_modules", "angular", "angular.js"));
});

app.get("/vendor/angular-route.js", function (req, res) {
    res.sendFile(path.join(__dirname, "../node_modules", "angular-route", "angular-route.js"));
});

app.use("/api/v1/cinefy", cinefyRoutes);
app.use("/api/v1/users", userRoutes);

const server = app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + server.address().port);
});
