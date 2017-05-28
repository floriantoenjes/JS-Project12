"use strict";

angular.module("app")

    .service("favoriteService", function ($http, authenticationService, userService) {

        this.getMyFavorites = function (callback) {
            $http.get("/api/v1/kinofy/favorites/", authenticationService.getAuthentication())
                .then(function (response) {
                    const albums = response.data;
                    callback(albums);
                });
        };


        this.getFavoritesFromUser = function (id, callback) {
            userService.getUser(id, function (user) {
                callback(user.favorites);
            });
        };


        this.addFavorite = function (album, callback) {
            $http.post("/api/v1/kinofy/favorites", album, authenticationService.getAuthentication()
            ).then(function (response) {
                callback(null, response);
            }).catch(callback);
        };

        this.removeFavorite = function (albumId, callback) {
            $http.delete(`/api/v1/kinofy/favorites/${albumId}`, authenticationService.getAuthentication())
                .then(function (response) {
                    callback(null, response);
                }).catch(callback);

        };
    });