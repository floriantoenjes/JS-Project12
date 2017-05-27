"use strict";

const request = require("supertest");
const User = require("../src/models/user");
const assert = require("assert");

describe("kinofy routes", function () {
    let server;
    let token = "";

    const kinofyPath = "/api/v1/kinofy";
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

    it("should not return movie and sountracks but unauthorized", function (done) {
        request(server)
            .get(`${kinofyPath}/search/rogue one`)
            .expect(401, done);
    });

    it("should return movie and soundtracks", function (done) {
        request(server)
            .get(`${kinofyPath}/search/rogue one`)
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(function (error, response) {
                assert(response.body.movie);
                assert(response.body.soundtracks);
                done();
            });
    });


});