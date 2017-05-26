"use strict";

angular.module("app")

    .controller("UserFavoritesController", function ($location, $scope, authenticationService) {

        $scope.backLink = "/#!/users";

        authenticationService.getFavoritesFromUser($location.path().split("/")[2], function (favorites) {
            $scope.favorites = favorites;
        });

    });