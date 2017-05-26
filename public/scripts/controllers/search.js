"use strict";

angular.module("app")

    .controller("SearchController", function ($location, $scope, authenticationService, dataService) {

        // Initialize Data
        $scope.currentUser = authenticationService.currentUser();

        authenticationService.getFavorites(function (favorites) {
            $scope.favoriteIds = getAlbumIds(favorites);
        });


        // Helper functions
        function getAlbumIds(albums) {
            const albumIds = [];
            for (let album of albums) {
                albumIds.push(album._id);
            }
            return albumIds;
        }

        // Functions
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
    });