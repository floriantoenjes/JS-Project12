const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({email: email})
        .exec(function (error, user) {
            if (error) {
                return callback(error);
            } else if (!user) {
                const err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            if (user.password === password) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
};

UserSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};


UserSchema.methods.validPassword = function (password) {
    return this.password === password;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;