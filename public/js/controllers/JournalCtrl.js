angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, $timeout, Supps, Journal) {
        var today = new Date();
        $scope.todayFormatted = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        $scope.currentDate = new Date($scope.todayFormatted);
        $scope.supps = [];
        $scope.journalIndex = 0;
        $scope.userId = 2;
        $scope.benefitAsJournalEntry = function(benefit) {
            return {
                benefitId: benefit._id,
                score: benefit.score
            };
        };

        $scope.saveBenefits = function(updatedBenefit) {
            Journal.save({
                date: $scope.currentDate,
                benefit: updatedBenefit,
                userId: $scope.userId
            });
            //save all the other benefits
            $scope.supps.forEach(function(supp) {
                supp.benefits.forEach(function(benefit) {
                    benefit = $scope.benefitAsJournalEntry(benefit);
                    if (benefit.benefitId !== updatedBenefit.benefitId) {
                        Journal.save({
                            date: $scope.currentDate,
                            benefit: benefit.benefitId,
                            userId: $scope.userId
                        });
                    }
                });
            });
            console.log("You've got what you wanted! You got what you always wanted.");
        };
        var journalValue = function(benefitId, journalEntries) {
            for (var i = 0; i < journalEntries.length; i++) {
                if (journalEntries[i].benefitId === benefitId) {
                    return journalEntries[i].score;
                }
            }
            return -1;
        };
        //used in this + result
        $scope.updateWithJournalValues = function(journalEntries) {
            $scope.supps.forEach(function(supp) {
                supp.benefits.forEach(function(benefit) {
                    var newScore = journalValue(benefit._id, journalEntries);
                    if (newScore !== -1) {
                        benefit.score = newScore;
                    }
                });
            });
        };
        $scope.addDefaultScore = function(benefit) {
            if (benefit.score === undefined) {
                benefit.score = 5;
            }
            return benefit;
        };

        $scope.getTodaysJournal = function() {
            Supps.get({date: $scope.currentDate, userId: $scope.userId})
                .success(function(data) {
                    var suppList = data;
                    //we don't have a benefit score so we need to set it.
                    suppList.forEach(function(supp) {
                        supp.benefits = supp.benefits.map($scope.addDefaultScore);
                    });
                    $scope.supps = suppList;
                    Journal.get(
                        {date: $scope.currentDate,
                            userId: $scope.userId}
                    ).success(function(journalEntries) {
                        $scope.updateWithJournalValues(journalEntries);
                    });
                });
        };

        $scope.getTodaysJournal();
        $scope.goToToday = function() {
            var today = new Date();
            $scope.currentDate.setDate(today.getDate());
            $scope.currentDate.setMonth(today.getMonth());
            $scope.currentDate.setYear(today.getFullYear());

            $scope.getTodaysJournal();
        };
        $scope.previousDay = function() {
            $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
            $scope.getTodaysJournal();
        };
        $scope.nextDay = function() {

            $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
            $scope.getTodaysJournal();
        };
    })

    .directive('star', function(Journal) {
        return {
            restrict: 'AEC',
            scope: {
                score: '=',
                date: '=',
                saveBenefits: '='

            },
            link: function(scope, element, attrs) {
                scope.benefitNames = scope.$parent.benefitNames;
                var starNumberConverter = function(value) {
                    return (value * 10) / 2;
                };
                scope.$watch("score", function(value) {
                    $(element).raty('score', value);
                });
                scope.onClick = function(score, event) {
                    var benefit = {benefitId: element.scope().benefit._id,
                        score: score};
                    scope.saveBenefits(benefit);
                };

//                scope.onClick = function(score, event) {
//                    //instead - save all!
////                    
////                    var benefit = {id: element.scope().benefit._id,
////                       };
////                    Journal.save({
////                        date: element.scope().date,
////                        benefit: benefit,
////                        userId: element.scope().userId
////                    });
//                };
                $(element).raty(
                    {
                        starType: 'i',
                        half: true,
                        halfShow: true,
                        round: {down: .25, full: .6, up: .76},
                        score: scope.score,
                        precision: false,
                        click: scope.onClick
                    }
                );
            }
        };
    });