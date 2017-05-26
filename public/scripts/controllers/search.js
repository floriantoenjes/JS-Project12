"use strict";

angular.module("app")

    .controller("SearchController", function ($location, $scope, authenticationService, dataService) {

        $scope.currentUser = authenticationService.currentUser();

        authenticationService.getFavorites(function (favorites) {
            $scope.favorites = getAlbumIds(favorites);
        });


        $scope.search = function (query) {
            if (query === undefined || query.trim().length === 0) {
                return;
            }
            dataService.getMovieSoundtrack(query, function (error, response) {
                if (error) {
                    const error = new Error();
                    error.message = `No results for ${query}.`;
                    return $scope.error = error;
                }
                $scope.error = false;
                $scope.results = response.data;
            });
        };

        $scope.logout = function () {
            authenticationService.logout();
            $location.path("/login");
        };


        $scope.addFavorite = function (album) {
            dataService.addFavorite(album, function (error, response) {
                if ($scope.favorites) {
                    $scope.favorites = [];
                }
                $scope.favorites.push(album.id);
            });
        };

        $scope.removeFavorite = function (album) {
            dataService.removeFavorite(album, function (error, response) {
                $scope.favorites.splice($scope.favorites.indexOf(album.id), 1);
            })
        }

        function getAlbumIds(albums) {
            const albumIds = [];
            for (let album of albums) {
                albumIds.push(album._id);
            }
            return albumIds;
        }
    });