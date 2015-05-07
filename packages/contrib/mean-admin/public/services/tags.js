//Tags service used for tags REST endpoint
angular.module('mean.mean-admin').factory("adminTags", ['$resource',
    function($resource) {
        return $resource('/admin/tags/:tagId', {
            tagId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
