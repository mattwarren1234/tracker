angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, Journal) {
        $scope.currentDate = new Date();
        $scope.supps = [];
        $scope.journalIndex = 0;

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

        $scope.getData();

        $scope.previousDay = function() {
            $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
            $scope.getData();
        };
        $scope.nextDay = function() {
            $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
            $scope.getData();
        };
    })
    .directive('star', function() {
        return {
            restrict: 'AEC',
            controller: function($scope) {
                $scope.getName = function(id) {
                    var benefitNames = ['improves stuff',
                        'improves things'];
                    if (id < 0 || id > benefitNames.length - 1) {
                        return "Not sure what this benefit is";
                    }
                    return benefitNames[id];
                };
            },
            link: function(scope, element, attrs) {
                scope.benefitNames = scope.$parent.benefitNames;
                var starNumberConverter = function(value) {
                    return (value * 10) / 2;
                };
                $(element).raty(
                    {starType: 'i',
                        half: true,
                        halfShow: true,
                        score: starNumberConverter(scope.benefit.score)}
                );
//                $(element).raty('score', );
            }
        };
    });