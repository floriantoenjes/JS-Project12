"use strict";

const express = require("express");
const morgan = require("morgan");

const cinefyRoutes = require("./routes/cinefy");


const app = express();

app.set("port", process.env.PORT || 5000);

app.use(morgan("dev"));

app.use("/", express.static("public"));

app.use("/api/v1/cinefy", cinefyRoutes);

const server = app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + server.address().port);
});
