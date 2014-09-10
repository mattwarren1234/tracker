angular.module('JournalCtrl', [])
    .controller('JournalController', function($scope, $timeout, Supps, Journal) {
//        $scope.currentDate = new Date();
        var today = new Date();
        $scope.todayFormatted = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        $scope.currentDate = new Date($scope.todayFormatted);
//      $scope.currentDate = new Date(today.getYear(), today.getMonth(), today.getDay())
        $scope.supps = [];
        $scope.journalIndex = 0;
        $scope.userId = 2;
        var journalValue = function(benefitId, journalEntries) {
            for (var i = 0; i < journalEntries.length; i++) {
                if (journalEntries[i].benefitId === benefitId) {
                    return journalEntries[i].score;
                }
            }
            return -1;
        };
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
    .directive('barsChart', function($parse) {
        //explicitly creating a directive definition variable
        //this may look verbose but is good for clarification purposes
        //in real life you'd want to simply return the object {...}
        var directiveDefinitionObject = {
            //We restrict its use to an element
            //as usually  <bars-chart> is semantically
            //more understandable
            restrict: 'E',
            //this is important,
            //we don't want to overwrite our directive declaration
            //in the HTML mark-up
            replace: false,
            //our data source would be an array
            //passed thru chart-data attribute
            scope: {data: '=chartData'},
            link: function(scope, element, attrs) {
                //in D3, any selection[0] contains the group
                //selection[0][0] is the DOM node
                //but we won't need that this time
                var chart = d3.select(element[0]);
                //to our original directive markup bars-chart
                //we add a div with out chart stling and bind each
                //data entry to the chart
                chart.append("div").attr("class", "chart")
                    .selectAll('div')
                    .data(scope.data).enter().append("div")
                    .transition().ease("elastic")
                    .style("width", function(d) {
                        return d + "%";
                    })
                    .text(function(d) {
                        return d + "%";
                    });
                //a little of magic: setting it's width based
                //on the data value (d) 
                //and text all with a smooth transition
            }
        };
        return directiveDefinitionObject;
    })
    .directive('star', function(Journal) {
        return {
            restrict: 'AEC',
            scope: {
                score: '=',
                date: '='
            },
            link: function(scope, element, attrs) {
                scope.date = scope.$parent.currentDate;
                scope.benefitNames = scope.$parent.benefitNames;
                scope.userId = scope.$parent.userId;
                var starNumberConverter = function(value) {
                    return (value * 10) / 2;
                };
                scope.$watch("score", function(value) {
                    $(element).raty('score', value);
                })
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