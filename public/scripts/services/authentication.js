"use strict";

angular.module("app")

    .service("authenticationService", function ($http, $window) {
        const vm = this;

        this.saveToken = function (token) {
            $window.localStorage["mean-token"] = token;
        };

        this.getToken = function () {
            return $window.localStorage["mean-token"];
        };

        this.logout = function () {
            $window.localStorage.removeItem("mean-token");
        };

        this.isLoggedIn = function () {
            const token = vm.getToken();
            let payload;

            if (token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        this.login = function (user, callback) {
            $http.post("/api/v1/users/login", user).then(function (response) {
                vm.saveToken(response.data.token);
                callback();
            });
        };

        this.register = function (user, callback) {
            $http.post("/api/v1/users/register", user).then(function (response) {
                console.log("Registered user");
                console.log("Response", response);
                vm.saveToken(response.data.token);
                callback();
            });
        }

        this.currentUser = function () {
            if (vm.isLoggedIn()) {
                const token = vm.getToken();
                let payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    email: payload.email
                };
            }
        }
    });