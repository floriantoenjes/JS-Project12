"use strict";

angular.module("app")

    .controller("FavoritesController", function ($scope, authenticationService) {

        $scope.backLink = "/#!";

        authenticationService.getFavorites(function (albums) {
            $scope.favorites = albums;
        });

    });