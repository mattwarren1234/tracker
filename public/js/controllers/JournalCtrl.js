angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, Supps) {
//model of already saved item
        $scope.supps = [];

        $scope.startDate = new Date();
        var today = new Date();
        var date10DaysAgo = (today.getDate() - 10);

        var asDays = function(diff) {
            return  Math.floor(diff / (1000 * 60 * 60 * 24));
        };
        $scope.daysInJournal = asDays(today - date10DaysAgo);

        $scope.supp1 = {
            date: new Date(),
            name: "Fish oil",
            benefits: [
                {description: "Reduces joint pain",
                    score: .5},
                {description: "Increases mental clarity",
                    score: .2}
            ]
        };

        $scope.supp2 = {
            date: new Date(),
            name: "Fish oil",
            benefits: [
                {description: "Reduces joint pain",
                    score: .5},
                {description: "Increases mental clarity",
                    score: .2}
            ]
        };
    });