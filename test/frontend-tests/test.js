'use strict';

// angular.module('app')
//     .controller('MyCtrl', ['$scope', function MyCtrl($scope) {
//         $scope.greeting = "hello";
//     }]);

describe('My controller', function() {
    var $controller, $scope;

    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, _$controller_) {
        $controller = _$controller_;
        $scope = $rootScope.$new();
    }));

    it('greets', function() {
        var controller = $controller('UsersController', {
            $scope: $scope
        });
        $scope.$digest();
        dump($scope.users);
    })

});