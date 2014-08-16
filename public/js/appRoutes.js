angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/supps',{
			templateUrl: 'views/supp.html',
			controller: 'SuppController'
		})

	$locationProvider.html5Mode(true);

}]);
