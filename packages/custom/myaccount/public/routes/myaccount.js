'use strict';

angular.module('mean.myaccount').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('My Account', {
      url: '/myaccount',
      templateUrl: 'myaccount/views/myaccount.html'
    });
  }
]);
