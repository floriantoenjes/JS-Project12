"use strict";

angular.module("app")

    .service("dataService", function ($http, authenticationService) {

        this.getMovieSoundtrack = function (query, callback) {
            $http.get(`/api/v1/kinofy/search/${query}`, {
                headers: {
                    Authorization: "Bearer " + authenticationService.getToken()
                }
            })
                .then(function (response) {
                    callback(null, response);
                }).catch(callback);
        };

    });