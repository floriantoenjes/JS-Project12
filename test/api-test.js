"use strict";

const request = require("supertest");
const User = require("../src/models/user");
const assert = require("assert");

describe("user routes", function () {
    let server;
    let token = "";
    let testUser2Id;

    const usersPath = "/api/v1/users";

    const testUser = {
        email: "user@test.com",
        password: "password"
    };

    const testUser2 = {
        email: "user2@test.com",
        password: "password"
    };

    before(function (done) {
        server = require("../src/index");

        User.remove({}, function (error) {
            if (error) {
                throw error;
            }

        }).then(function () {
            const user2 = new User(testUser2);

            user2.save(function (error, user) {
                if (error) {
                    throw error;
                }
                testUser2Id = user._id;
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


    });

    after(function (done) {
        server.close();
        done();
    });

    it("should login", function (done) {
        request(server)
            .post(`${usersPath}/login`)
            .send(testUser)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8", done);
    });

    it("should not return all users but unauthorized", function (done) {
        request(server)
            .get(`${usersPath}`)
            .expect(401, done);
    });

    it("should get all users", function (done) {
        request(server)
            .get(`${usersPath}`)
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(function (error, response) {
                assert(response.body.length, 2);
                done();
            });

    });

    it("should not return a single user but unauthorized", function (done) {
        request(server)
            .get(`${usersPath}/${testUser2Id}`)
            .expect(401, done);
    });

    it("should return a single user", function (done) {
        request(server)
            .get(`${usersPath}/${testUser2Id}`)
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(function (error, response) {
                console.log(response.body);
                assert(response.body.email, "user2@test.com");
                done();
            });
    });

});