"use strict";

angular.module("app")

    .controller("MyFavoritesController", function ($scope, authenticationService, dataService) {

        // Initialize Data
        authenticationService.getMyFavorites(function (albums) {
            $scope.favorites = albums;
        });

        // Functions
        $scope.addFavorite = function (album) {
            dataService.addFavorite(album, function (error, response) {
                if (!$scope.favoriteIds) {
                    $scope.favoriteIds = [];
                }
                $scope.favoriteIds.push(album.id);
            });
        };

        $scope.removeFavorite = function (album) {
            dataService.removeFavorite(album.id, function (error, response) {
                $scope.favoriteIds.splice($scope.favorites.indexOf(album), 1);
            })
        };

        $scope.removeFavoriteById = function (albumId) {
            dataService.removeFavorite(albumId, function (error, response) {
                authenticationService.getMyFavorites(function (albums) {
                    $scope.favorites = albums;
                });

            })
        };

    });