"use strict";

const request = require("supertest");
const User = require("../src/models/user");

describe("user routes", function () {
    let server;
    let token = "";

    const usersPath = "/api/v1/users";

    const testUser = {
        email: "testuser@test.com",
        password: "password"
    };

    before(function (done) {
        server = require("../src/index");

        User.remove({}, function (error) {
            if (error) {
                throw error;
            }

            request(server)
                .post(`${usersPath}/register`)
                .send(testUser)
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
            .expect("Content-Type", "application/json; charset=utf-8", done);
    });

});