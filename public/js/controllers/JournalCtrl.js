angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, Journal) {
        $scope.currentDate = new Date();
        $scope.supps = [];
        $scope.journalIndex = 0;

        $scope.getData = function() {
//            $scope.supps = [{"name": "supp1",
//                    "benefits": [
//                        {"name": "benefit1",
//                            "score": 0.3
//                        },
//                        {"name": "benefit2",
//                            "score": 0.4}
//                    ]}];
//            return;
            Journal.get($scope.currentDate)
                .success(function(data) {
                    $scope.supps = data;
                    if (Array.isArray(data)) {
                        $scope.supps = data;
                    } else {
                        $scope.supps = [data];
                    }
                    console.log($scope.supps.length);
//                    $scope.supps = [{"name": "supp1",
//                            "benefits": [
//                                {"name": "benefit1",
//                                    "score": 0.3
//                                },
//                                {"name": "benefit2",
//                                    "score": 0.4}
//                            ]}];

//                data.forEach(function(item){
//                    
//                });
                })
                .error(function(data) {
                });
        };

        $scope.getData();

        $scope.previousDay = function() {
        };
        $scope.nextDay = function() {
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