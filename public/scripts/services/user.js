"use strict";

angular.module("app")

    .service("userService", function ($http, authenticationService) {

        this.getAllUsers = function (callback) {
            $http.get("/api/v1/users",  authenticationService.getAuthentication()).then(function (response) {
                const users = response.data;

                callback(users);
            })
        };

        this.getUser = function (id, callback) {
            $http.get(`/api/v1/users/${id}`, authenticationService.getAuthentication()).then(function (response) {
                const user = response.data;
                callback(user);
            });
        };

    });