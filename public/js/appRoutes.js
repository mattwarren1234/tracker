angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController'
            })

            .when('/supps', {
                templateUrl: 'views/supp.html',
                controller: 'SuppController'
            })
            .when('/journal', {
                templateUrl: 'views/journal.html',
                controller: 'JournalController'
            })
                .when('/results', {
                templateUrl: 'views/results.html',
                controller: 'ResultController'
            });


        $locationProvider.html5Mode(true);

    }]);
