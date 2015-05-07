'use strict';

angular.module('mean.mean-admin').controller('AdminTagsController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'Tags',
    function($scope, Global, Menus, $rootScope, $http, Tags) {
        $scope.global = Global;
        $scope.tagSchema = [{
            label: 'label',
            schemaKey: 'label',
            type: 'text',
            inTable: true
        },  {
            title: 'deals',
            schemaKey: 'deals',
            type: 'select',
            inTable: true
        }];
        $scope.tag = {};

        $scope.init = function() {
            Tags.query({}, function(tags) {
                $scope.tags = tags;
            });
        };

        $scope.add = function() {
            if (!$scope.tags) $scope.tags = [];

            var tag = new Tags({
                label: $scope.tag.label,
                deals: $scope.tag.deals
            });

            tag.$save(function(response) {
                $scope.tags.push(response);
            });

            this.label = this.deals = '';
        };

        $scope.remove = function(tag) {
            for (var i in $scope.tags) {
                if ($scope.tags[i] === tag) {
                    $scope.tags.splice(i, 1);
                }
            }

            tag.$remove();
        };

        $scope.update = function(tag) {
                tag.$update();
        };
    }
]);
