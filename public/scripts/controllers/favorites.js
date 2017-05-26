"use strict";

angular.module("app")

    .controller("FavoritesController", function ($scope, authenticationService) {

        authenticationService.getFavorites(function (albums) {
            $scope.favorites = albums;
        });

    });