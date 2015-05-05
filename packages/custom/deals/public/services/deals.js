'use strict';

//Deals service used for deals REST endpoint
angular.module('mean.deals').factory('Deals', ['$resource',
  function($resource) {
    return $resource('deals/:dealId', {
      dealId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
