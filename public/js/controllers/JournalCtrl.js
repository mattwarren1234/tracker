angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, Supps) {
//model of already saved item
        $scope.supps = [];

        $scope.startDate = new Date();
        var today = new Date();
        var startDate = new Date();
        startDate.setDate(today.getDate() - 10);

        $scope.asDays = function(diff) {
            return  Math.floor(diff / (1000 * 60 * 60 * 24));
        };
        $scope.daysInJournal = $scope.asDays(today - startDate);

        var supp1 = {
            date: new Date(),
            name: "Fish oil",
            benefits: [
                {description: "Reduces joint pain",
                    score: .5},
                {description: "Increases mental clarity",
                    score: .2}
            ]
        };

        var supp2 = {
            date: new Date(),
            name: "vitamin d",
            benefits: [
                {description: "Increases wakefulness",
                    score: .5},
            ]
        };

        $scope.supps = [supp1, supp2];

        $scope.previousDay = function() {
        };
        $scope.nextDay = function() {
        };
//        $("#rating").raty({ starType: 'i' });
        $('#rating').text("<p>test</p>");

    })
    .directive('star', function() {
        return {
            restrict: 'AEC',
            link: function(scope, element, attrs) {
                $(element).raty({starType: 'i'});
            }
        };
    });