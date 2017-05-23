"use strict";

angular.module("app").config(config);

function config($routeProvider) {
    $routeProvider.when("/", {
        controller: "SearchController",
        controllerAs: "vm",
        templateUrl: "templates/search.html"
    });
}