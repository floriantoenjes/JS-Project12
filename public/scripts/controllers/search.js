"use strict";

angular.module("app")

.controller("SearchController", function ($scope, authenticationService, dataService) {

    $scope.search = function (query) {
        dataService.getMovieSoundtrack(query, function (response) {
            $scope.results = response.data;
        });
    };

    $scope.currentUser = authenticationService.currentUser();
});