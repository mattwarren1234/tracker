angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, $timeout, Supps, Journal) {
//        $scope.currentDate = new Date();
        var today = new Date();
        $scope.currentDate = new Date();
//        $scope.currentDate = new Date(today.getYear(), today.getMonth(), today.getDay())
        $scope.supps = [];
        $scope.journalIndex = 0;
        $scope.userId = 2;
        var journalValue = function(benefitId, journalEntries) {
            for (var i = 0; i < journalEntries.length; i++) {
                if (journalEntries[i].benefitId === benefit._id) {
                    return journalEntries[i].score;
                }
            }
            return -1;
        };
        Supps.get()
            .success(function(data) {
                var suppList = data;
                //we don't have a benefit score so we need to set it.
                suppList.forEach(function(supp) {
                    supp.benefits = supp.benefits.map(function(benefit) {
                        if (benefit.score === undefined) {
                            benefit.score = 0.5;
                        }
                        return benefit;
                    });
                });
                $scope.supps = suppList;
                Journal.get(
                    {date: $scope.currentDate,
                        userId: $scope.userId}
                ).success(function(journalEntries) {
                    $scope.supps.forEach(function(supp) {
                        supp.benefits.forEach(function(benefit) {
                            var newScore = journalValue(benefit._id, journalEntries) ;
                            if (newScore !== -1) { benefit.score = newScore; }
                        });
                    });
                });
            });

        $scope.getData = function() {
            Journal.get($scope.currentDate)
                .success(function(data) {
                    $scope.supps = data;
                    if (Array.isArray(data)) {
                        $scope.supps = data;
                    } else {
                        $scope.supps = [data];
                    }
                })
                .error(function(data) {
                });
        };

//        $scope.getData();

        $scope.previousDay = function() {
            $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
            $scope.getData();
        };
        $scope.nextDay = function() {
            $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
            $scope.getData();
        };
    })
    .directive('star', function(Journal) {
        return {
            restrict: 'AEC',
            scope: {
                score: '='
            },
            link: function(scope, element, attrs) {
                scope.date = scope.$parent.currentDate;
                scope.benefitNames = scope.$parent.benefitNames;
                scope.userId = scope.$parent.userId;
                var starNumberConverter = function(value) {
                    return (value * 10) / 2;
                };
                scope.$watch("score", function(value) {
                    console.log("new value is " + value);
                    $(element).raty('score', value);
                })
                scope.$watch(attrs.score, function(value) {
                    console.log("changed yo!");
                });
                scope.saveRating = function() {
                    console.log($(element).raty('score'));
                    console.log("about to save rating!");
                };
                scope.onClick = function(score, event) {
                    var benefit = {id: element.scope().benefit._id,
                        score: score};
                    Journal.save({
                        date: element.scope().date,
                        benefit: benefit,
                        userId: element.scope().userId
                    }).success(function(data) {
                        console.log(data);
                    });
                };
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