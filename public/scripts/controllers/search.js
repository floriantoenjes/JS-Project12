"use strict";

angular.module("app")

    .controller("SearchController", function ($location, $scope, authenticationService, dataService, favoriteService) {

        // Initialize Data
        $scope.currentUser = authenticationService.currentUser();

        favoriteService.getMyFavorites(function (favorites) {
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
            $scope.disableSearch = true;

            if (query === undefined || query.trim().length === 0) {
                $scope.disableSearch = false;
                return;
            }
            dataService.getMovieSoundtrack(query, function (error, response) {
                if (error) {
                    const error = new Error();
                    error.message = `No results for ${query}.`;

                    $scope.disableSearch = false;
                    return $scope.error = error;
                }

                $scope.disableSearch = false;
                $scope.error = false;
                $scope.results = response.data;
            });
        };
    });