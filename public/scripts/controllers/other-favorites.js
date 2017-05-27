"use strict";

angular.module("app")

    .controller("OtherFavoritesController", function ($location, $scope, favoriteService) {

        // Initialize Data
        favoriteService.getFavoritesFromUser($location.path().split("/")[2], function (favorites) {
            $scope.favorites = favorites;
        });

    });