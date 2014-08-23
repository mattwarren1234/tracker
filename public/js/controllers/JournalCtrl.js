angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, Supps) {
//model of already saved item
        $scope.supps = [];

        $scope.startDate = new Date();
        var today = new Date();
        var startDate = new Date();
        startDate.setDate(today.getDate() - 10);

        $scope.asDays = function(diff) {
            console.log(startDate.getDate());
            console.log("diff is "+ diff);
            console.log(diff / (1000 * 60 * 60 * 24));
            return  Math.floor(diff / (1000 * 60 * 60 * 24));
        };
        $scope.daysInJournal = $scope.asDays(today - startDate);

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