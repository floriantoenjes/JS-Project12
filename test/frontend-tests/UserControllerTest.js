'use strict';

describe('UsersController', function () {
    let $controller, $scope;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, _$controller_) {
        $controller = _$controller_;
        $scope = $rootScope.$new();
    }));

    it("should initialize users", inject(function ($httpBackend) {
        let controller = $controller('UsersController', {
            $scope: $scope
        });
        $httpBackend.whenGET("/api/v1/users").respond([
            {"_id": "5929b5d7475e8123f4fda449", "email": "user2@test.com"},
            {"_id": "5929b5d7475e8123f4fda44a", "email": "user@test.com"}
            ]);
        $httpBackend.flush();

        $scope.$digest();

        expect($scope.users.length).toBe(2);
    }));
});