"use strict";

angular.module("app")

    .service("dataService", function ($http, authenticationService) {

        this.getMovieSoundtrack = function (query, callback) {
            $http.get(`/api/v1/kinofy/search/${query}`, authenticationService.getAuthentication())
                .then(function (response) {
                    callback(null, response);
                }).catch(callback);
        };

    });