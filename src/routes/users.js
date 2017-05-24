const express = require("express");
const router = express.Router();

const User = require("../models/user");


router.post("/register", function (req, res, next) {
    const user = new User(req.body);
    user.save(function (error, user) {
        if (error) {
            console.log(error);
            return next(error);
        }
        const token = user.generateJwt();
        res.status(201);
        return res.json({
            token: token
        });
    })
});

router.post("/login", function (req, res, next) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
        if (error) {
            return next(error);
        } else if (!user) {
            res.status(401);
            return res.send();
        }
        return res.json({
            "token": user.generateJwt()
        });

    });
});


module.exports = router;