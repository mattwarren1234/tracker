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
    .directive('barsChart', function() {
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
                })
            }}
    })
    .directive('lineGraph', function() {
        return{
            restrict: 'E',
            scope: {data: '=chartData'},
            link: function(scope, element, attrs) {
                var chart = d3.select(element[0]);
                var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var parseDate = d3.time.format("%d-%b-%y").parse;

                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .x(function(d) {
                        return x(d.date);
                    })
                    .y(function(d) {
                        return y(d.close);
                    });

                var svg = d3.select("body").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                d3.tsv("data.tsv", function(error, data) {
                    data.forEach(function(d) {
                        d.date = parseDate(d.date);
                        d.close = +d.close;
                    });

                    x.domain(d3.extent(data, function(d) {
                        return d.date;
                    }));
                    y.domain(d3.extent(data, function(d) {
                        return d.close;
                    }));

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Price ($)");

                    svg.append("path")
                        .datum(data)
                        .attr("class", "line")
                        .attr("d", line);
                });


            }
        };
    });
             