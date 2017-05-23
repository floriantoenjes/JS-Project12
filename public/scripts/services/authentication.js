"use strict";

angular.module("app")

    .service("authenticationService", function ($http, $window) {

        this.saveToken = function (token) {
            $window.localStorage["mean-token"] = token;
        };

        this.getToken = function () {
            return $window.localStorage["mean-token"];
        };

        this.logout = function () {
            $window.localStorage.removeItem("mean-token");
        }

        this.isLoggedIn = function() {
            const token = getToken();
            let payload;

            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        this.login = function (user) {
            $http.post("/api/v1/users/login", user).success(function (data) {
                saveToken(data.token);
            });
        }


    });