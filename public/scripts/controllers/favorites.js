"use strict";

angular.module("app")

    .controller("MyFavoritesController", function ($scope, authenticationService) {

        // Initialize Data
        $scope.backLink = "/#!";

        authenticationService.getFavorites(function (albums) {
            $scope.favorites = albums;
        });

    });