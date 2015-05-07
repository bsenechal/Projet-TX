'use strict';

angular.module('mean.mean-admin').controller('AdminController', ['$scope', 'Global', 'Menus', '$rootScope',
    function($scope, Global, Menus, $rootScope) {
        $scope.global = Global;
        $scope.menus = {};
        $scope.overIcon = false;

        var icons = 'mean-admin/assets/img/icons/';

        // Default hard coded menu items for main menu
        var defaultAdminMenu = [{
            'roles': ['admin'],
            'title': 'MODULES',
            'link': 'modules',
            'icon': 'glyphicon glyphicon-list-alt'
        }, {
            'roles': ['admin'],
            'title': 'THEMES',
            'link': 'themes',
            'icon': 'glyphicon glyphicon-eye-open'
        }, {
            'roles': ['admin'],
            'title': 'SETTINGS',
            'link': 'settings',
            'icon': 'glyphicon glyphicon-cog'
        }, {
            'roles': ['admin'],
            'title': 'USERS',
            'link': 'users',
            'icon': 'glyphicon glyphicon-user'
        }, {
            'roles': ['admin'],
            'title': 'DEALS',
            'link': 'adminDeals',
            'icon': 'glyphicon glyphicon-search'
        },{
            'roles': ['admin'],
            'title': 'TAGS',
            'link': 'adminTags',
            'icon': 'glyphicon glyphicon-font'
        }];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {

            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function(menu) {
                $scope.menus[name] = menu;
            });
        }

        // Query server for menus and check permissions
        queryMenu('admin', defaultAdminMenu);

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function() {

            queryMenu('admin', defaultAdminMenu);

            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
        });
    }
]);
