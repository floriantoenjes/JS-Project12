"use strict";

angular.module("app")

    .controller("UserFavoritesController", function ($location, $scope, authenticationService) {

        authenticationService.getFavoritesFromUser($location.path().split("/")[2], function (favorites) {
            console.log("Location:", $location.path().split("/")[2]);
            $scope.favorites = favorites;
        });

    });