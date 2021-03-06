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

        this.getAuthentication = function () {
            return {
                headers: {
                    Authorization: "Bearer " + vm.getToken()
                }
            };
        };

        this.register = function (user, callback) {
            $http.post("/api/v1/users/register", user).then(function (response) {
                vm.saveToken(response.data.token);
                callback();
            }).catch(callback);
        };

        this.login = function (user, callback) {
            $http.post("/api/v1/users/login", user).then(function (response) {
                vm.saveToken(response.data.token);

                callback();
            }).catch(callback);
        };

        this.logout = function () {
            $window.localStorage.removeItem("mean-token");
        };

        this.isLoggedIn = function () {
            const token = vm.getToken();
            let payload;

            if (token) {
                try {
                    payload = token.split('.')[1];
                    payload = $window.atob(payload);
                    payload = JSON.parse(payload);
                } catch (error) {
                    return false;
                }
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };


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
        };

    });