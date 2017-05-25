"use strict";

angular.module("app")

    .service("dataService", function ($http, authenticationService) {

        this.getMovieSoundtrack = function (query, callback) {
            $http.get(`/api/v1/kinofy/${query}`, {
                headers: {
                    Authorization: "Bearer " + authenticationService.getToken()
                }
            })
                .then(function (response) {
                    callback(null, response);
                }).catch(function (error) {
                    callback(error);
            });
        };
    });