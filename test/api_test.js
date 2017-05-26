"use strict";

const request = require("supertest");
const User = require("../src/models/user");

describe("user routes", function () {
    let server;
    let token = "";

    before(function (done) {
        server = require("../src/index");

        User.remove({}, function (error) {
            if (error) {
                throw error;
            }

            request(server)
                .post("/api/v1/users/register")
                .send({
                    email: "testuser@test.com",
                    password: "password"
                })
                .end(function (error, res) {
                    const result = JSON.parse(res.text);
                    token = result.token;
                    console.log(result);
                    done();
                });
        });


    });

    after(function (done) {
        server.close();
        done();
    });

    it("should login", function (done) {
        request(server)
            .post("/api/v1/users/login")
            .send({
                email: "testuser@test.com",
                password: "password"
            })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8", done);
    });

    it("should get all users", function (done) {
        request(server)
            .get("/api/v1/users")
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8", done);
    });

});