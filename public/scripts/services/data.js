"use strict";

angular.module("app")

    .service("dataService", function ($http) {

        this.getMovieSoundtrack = function (query, callback) {
            $http.get(`/api/v1/cinefy/${query}`)
                .then(callback);
        }

    });