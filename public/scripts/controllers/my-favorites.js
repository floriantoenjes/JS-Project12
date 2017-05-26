"use strict";

angular.module("app")

    .controller("MyFavoritesController", function ($scope, authenticationService, dataService) {

        // Initialize Data
        $scope.backLink = "/#!";

        authenticationService.getFavorites(function (albums) {
            $scope.favorites = albums;
        });

        // Functions
        $scope.addFavorite = function (album) {
            dataService.addFavorite(album, function (error, response) {
                if (!$scope.favorites) {
                    $scope.favorites = [];
                }
                $scope.favorites.push(album.id);
            });
        };

        $scope.removeFavorite = function (album) {
            dataService.removeFavorite(album, function (error, response) {
                $scope.favorites.splice($scope.favorites.indexOf(album.id), 1);
            })
        };

    });