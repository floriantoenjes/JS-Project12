"use strict";

const request = require("supertest");
const User = require("../src/models/user");
const Soundtrack = require("../src/models/soundtrack");
const assert = require("assert");

describe("favorite routes", function () {
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

    it("should add a favorite", function (done) {
        request(server)
            .post(`${favoritesPath}`)
            .set("Authorization", "Bearer " + token)
            .send({
                    album_type: 'album',
                    artists: [{
                        external_urls: [Object],
                        href: 'https://api.spotify.com/v1/artists/7oPgCQqMMXEXrNau5vxYZP',
                        id: '7oPgCQqMMXEXrNau5vxYZP',
                        name: 'Tracy Chapman',
                        type: 'artist',
                        uri: 'spotify:artist:7oPgCQqMMXEXrNau5vxYZP'
                    }],
                    external_urls: {spotify: 'https://open.spotify.com/album/6hmmX5UP4rIvOpGSaPerV8'},
                    href: 'https://api.spotify.com/v1/albums/6hmmX5UP4rIvOpGSaPerV8',
                    id: '6hmmX5UP4rIvOpGSaPerV8',
                    images: [{
                        height: 640,
                        url: 'https://i.scdn.co/image/5c69dfb7c6bd99518facb068fec7b92df2df10c8',
                        width: 640
                    },
                        {
                            height: 300,
                            url: 'https://i.scdn.co/image/3cc11a45d3ab979dbcf95a1a360a79902e1aaa96',
                            width: 300
                        },
                        {
                            height: 64,
                            url: 'https://i.scdn.co/image/50f234dac4a4e3786d397124716da80127548727',
                            width: 64
                        }],
                    name: 'Tracy Chapman',
                    type: 'album',
                    uri: 'spotify:album:6hmmX5UP4rIvOpGSaPerV8'
                }
            )
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(function (error, response) {
                assert.equal(response.body.ok, 1);
                assert.equal(response.body.nModified, 1);
                assert.equal(response.body.n, 1);
                User.findOne({email: "user@test.com"}, function (error, user) {
                    assert.equal(user.favorites.length, 1);
                }).then(function (user) {
                    Soundtrack.findById("6hmmX5UP4rIvOpGSaPerV8").then(function (soundtrack) {
                        assert(soundtrack);
                        done();
                    });

                });
            });
    });

    it("should get a favorite", function (done) {
        request(server)
            .get(`${favoritesPath}`)
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .end(function (error, response) {
                assert.equal(response.body.length, 1);
                done();
            });

    });

    it("should remove a favorite", function (done) {
        request(server)
            .delete(`${favoritesPath}/6hmmX5UP4rIvOpGSaPerV8`)
            .set("Authorization", "Bearer " + token)
            .expect(204)
            .end(function (error, response) {
                User.findOne({email: "user@test.com"}, function (error, user) {
                    assert.equal(user.favorites.length, 0);
                    done();
                });
            });
    });

});