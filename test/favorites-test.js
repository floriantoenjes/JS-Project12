"use strict";

const request = require("supertest");
const User = require("../src/models/user");
const assert = require("assert");

describe("user routes", function () {
    let server;
    let token = "";

    const favoritesPath = "/api/v1/kinofy/favorites";
    const usersPath = "/api/v1/users";

    const testUser = {
        email: "user@test.com",
        password: "password"
    };

    before(function (done) {
        server = require("../src/index");

        User.remove({}, function (error) {
            if (error) {
                throw error;
            }

        }).then(function () {
            request(server)
                .post(`${usersPath}/register`)
                .send(testUser)
                .end(function (error, res) {
                    const result = JSON.parse(res.text);
                    token = result.token;
                    done();
                });
        });


    });

    after(function (done) {
        server.close();
        done();
    });

});