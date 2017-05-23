"use strict";

angular.module("app")

    .service("dataService", function ($http, authenticationService) {

        this.getMovieSoundtrack = function (query, callback) {
            $http.get(`/api/v1/cinefy/${query}`, {
                headers: {
                    Authorization: "Bearer " + authenticationService.getToken()
                }
            })
            .then(callback);
        }

    });