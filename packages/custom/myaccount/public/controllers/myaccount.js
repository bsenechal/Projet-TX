'use strict';

angular.module('mean.myaccount').controller('MyaccountController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'Users',
    function($scope, Global, Menus, $rootScope, $http, Users) {
        $scope.global = Global;
        $scope.user = {};

        $scope.init = function() {
          $scope.user = Global.user;
        };

        $scope.update = function(user, userField) {
          user.$update();
        };
    }
]);
