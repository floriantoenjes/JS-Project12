const express = require("express");
const router = express.Router();

const User = require("../models/user");


router.post("/register", function (req, res, next) {
    const user = new User(req.body);
    user.save(function (error, user) {
        if (error) {
            return next(error);
        }
        const token = user.generateJwt();
        res.status(201);
        res.json({
            token: token
        });
    })
});

router.post("/login", function (req, res, next) {

});


module.exports = router;