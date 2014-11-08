angular.module('JournalCtrl', [])
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