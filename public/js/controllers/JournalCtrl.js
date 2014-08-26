angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, Supps) {
        $scope.currentDate = new Date();
        $scope.getSuppEffectHistory = function() {
            //SHOULD MAKE CALL TO SERVER. ALAS, it was not meant to be for this iteration.
            return  [
                {date: new Date(2013, 12, 1),
                    score: 0.2},
                {date: new Date(2013, 11, 1),
                    score: 0.2},
                {date: new Date(),
                    score: 0.2}
            ];
        };

        $scope.getSuppEffectHistory = function() {
            //SHOULD MAKE CALL TO SERVER. ALAS, it was not meant to be for this iteration.
            return [
                {date: new Date(),
                    data: [
                        {benefitId: 1, score: 0.5},
                        {benefitId: 2, score: 0.2}
                    ]}
            ];

        };
        var sameDay = function(date1, date2) {
            try {
                return (date1.getFullYear() === date2.getFullYear()
                    && date1.getDate() === date2.getDate()
                    && date1.getMonth() === date2.getMonth());
            } catch (err) {
                console.log(err);
            }

        }
        $scope.benefitNames = ['improves stuff',
            'improves things'];
        $scope.effectData = {};
        $scope.onLoad = function() {
            $scope.supp = {};
//assuming for one right now.            
            $scope.supp.history = $scope.getSuppEffectHistory();
            var today = new Date();
            $scope.journalIndex = -1;
            for (var i = 0; i < $scope.supp.history.length; i++) {
                console.log($scope.supp.history[i].date);
                if (sameDay(today, $scope.supp.history[i].date)) {
                    $scope.journalIndex = i;
                    $scope.effectData = $scope.supp.history[i].data;
                    break;
                }
            }
            if ($scope.journalIndex === -1) {
                console.log("Error! Date not found in index");
                //add new item, i guess? and then just push stuff?

            }
        };

        $scope.onLoad();
//            var supp2 = {
//                date: new Date(),
//                name: "vitamin d",
//                benefits: [
//                    {description: "Increases wakefulness",
//                        score: .5}
//                ]
//            };
//            $scope.todaySupps =
//                {today: [supp1, supp2]};
//            var today = new Date();
//            var yesterday = new Date();
//            yesterday.setDate(today.getDate() - 1);
//            var tomorrow = new Date();
//            tomorrow.setDate(today.getDate() + 1);

//        };
//        $scope.supps = [supp1, supp2];

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