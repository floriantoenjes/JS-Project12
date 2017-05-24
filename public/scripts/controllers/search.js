"use strict";

angular.module("app")

    .controller("SearchController", function ($route, $scope, authenticationService, dataService) {

        $scope.search = function (query) {
            if (query === undefined || query.trim().length === 0) {
                return;
            }
            dataService.getMovieSoundtrack(query, function (error, response) {
                if (error) {
                    const error = new Error();
                    error.message = "The search gave no results.";
                    return $scope.error = error;
                }
                $scope.error = false;
                $scope.results = response.data;
            });
        };

        $scope.currentUser = authenticationService.currentUser();

        $scope.logout = function () {
            authenticationService.logout();
            $route.reload();
        };
    });