"use strict";

angular.module("app")

    .controller("MyFavoritesController", function ($scope, favoriteService) {

        // Initialize Data
        favoriteService.getMyFavorites(function (albums) {
            $scope.favorites = albums;
        });

        // Functions
        $scope.addFavorite = function (album) {
            favoriteService.addFavorite(album, function (error, response) {
                if (!$scope.favoriteIds) {
                    $scope.favoriteIds = [];
                }
                $scope.favoriteIds.push(album.id);
            });
        };

        $scope.removeFavorite = function (album) {
            favoriteService.removeFavorite(album.id, function (error, response) {
                $scope.favoriteIds.splice($scope.favorites.indexOf(album), 1);
            })
        };

        $scope.removeFavoriteById = function (albumId) {
            favoriteService.removeFavorite(albumId, function (error, response) {
                favoriteService.getMyFavorites(function (albums) {
                    $scope.favorites = albums;
                });

            })
        };

    });