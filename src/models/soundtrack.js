"use strict";

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const SoundtrackSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    },
    imageUrl: String

});

SoundtrackSchema.plugin(uniqueValidator);

const Soundtrack = mongoose.model("Soundtrack", SoundtrackSchema);
module.exports = Soundtrack;