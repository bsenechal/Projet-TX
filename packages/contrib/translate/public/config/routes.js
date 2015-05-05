angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('languages', {
				url: '/admin/languages',
				templateUrl: 'translate/views/index.html',
			});
	}
])
