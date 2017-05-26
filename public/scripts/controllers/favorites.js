"use strict";

angular.module("app")

    .controller("FavoritesController", function ($scope, authenticationService) {


        // Initialize Data
        $scope.backLink = "/#!";

        authenticationService.getFavorites(function (albums) {
            $scope.favorites = albums;
        });

    });