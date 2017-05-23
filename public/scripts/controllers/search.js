"use strict";

angular.module("app")

.controller("SearchController", function ($scope, dataService) {

    $scope.search = function (query) {
        dataService.getMovieSoundtrack(query, function (response) {
            $scope.results = response.data;
        });
    };

});