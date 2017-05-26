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
                }).catch(function (error) {
                    callback(error);
            });
        };

        this.addFavorite = function (album, callback) {
            $http.post("/api/v1/kinofy/favorites", album, {
                headers: {
                    Authorization: "Bearer " + authenticationService.getToken()
                }
            }).then(function (response) {
                callback(null, response)
            });
        };

        this.removeFavorite = function (album, callback) {
            $http.delete(`/api/v1/kinofy/favorites/${album.id}`, {
                headers: {
                    Authorization: "Bearer " + authenticationService.getToken()
                }
            }).then(callback);

        };
    });