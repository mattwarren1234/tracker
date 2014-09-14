"use strict";
angular.module('ResultCtrl', [])
    .controller('ResultController', function($scope, Supps, Journal) {
        $scope.supps = [];

        var scoreAdapter = function(supps) {
            return supps.map(function(supp) {
                return supp.benefits.map(function(benefit) {
                    benefit.score = 0;
                    return benefit;
                });
            });
        };
        $scope.addDefaultScore = function(benefit) {
            if (benefit.score === undefined) {
                benefit.score = 5;
            }
            return benefit;
        };
        $scope.getAverageValues = function() {
            var userId = 2;
            Journal.averages(userId)
                .success(function(data) {
                    $scope.updateWithJournalValues(data);
                });
        };
        Supps.get({userId: $scope.userId})
            .success(function(suppList) {
                suppList.forEach(function(supp) {
                    supp.benefits = supp.benefits.map($scope.addDefaultScore);
                });
                $scope.supps = suppList;
                $scope.getAverageValues();
            });

        var asBenefit = function(benefit) {
            return {_id: benefit._id,
                score: benefit.avgScore};
        };
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
                var newBenefits = [];
                supp.benefits.forEach(function(benefit) {
                    var newScore = journalValue(benefit._id, journalEntries);
                    if (newScore !== -1) {
                        benefit.score = newScore;
                    }
                    console.log("benefit score is " + benefit.score);
                    newBenefits.push(benefit);
                });
                supp.benefits = newBenefits;
            });
        };
        $scope.testCall = function() {
          $scope.getAverageValues();
        };
    })
    .directive('barsChart', function($parse) {
        return {
            restrict: 'E',
            //this is important,
            //we don't want to overwrite our directive declaration
            //in the HTML mark-up
            replace: false,
            //our data source would be an array
            //passed thru chart-data attribute
            scope: {data: '=chartData'},
            link: function(scope, element, attrs) {
                var chart = d3.select(element[0])
                    .append("div").attr("class", "chart");

                scope.$watch('data', function(newVal, oldVal) {
                    console.log("data updated");
                    var barGraph = chart
                        .selectAll('div')
                        .data(newVal);

                    var scoreAsPercent = function(score) {
                        console.log("score set to " + score);
                        var maxScore = 5;
                        var percentage = score / 5;
                        return percentage * 100;
                    };
                    var barText = function(d) {
                        return d.description + " : " + scoreAsPercent(d.score).toFixed(0) + "%";
                    };
                    var barStyle = function(d) {
                        return scoreAsPercent(d.score) + "%";
                    };

                    barGraph.enter()
                        .append("div")
                        .transition().ease("elastic")
                        .style("width", function(d) {
                            return barStyle(d);
                        })
                        .text(function(d) {
                            return barText(d);
                        });

                    barGraph
                        .transition().ease("elastic")
                        .style("width", function(d) {
                            return barStyle(d);
                        })
                        .text(function(d) {
                            return barText(d);
                        });

                    barGraph
                        .exit()
                        .remove();
                });






            }
        };
    });