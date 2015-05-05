//Deals service used for deals REST endpoint
angular.module('mean.mean-admin').factory("adminDeals", ['$resource',
    function($resource) {
        return $resource('/admin/deals/:dealId', {
            dealId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
