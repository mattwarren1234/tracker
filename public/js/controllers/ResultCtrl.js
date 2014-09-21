"use strict";
angular.module('ResultCtrl', [])
    .controller('ResultController', function($scope, Supps, Journal) {
        $scope.supps = [];
        $scope.userId = 2;
        $scope.overTimeList = [];
        $scope.tab = {};
        $scope.tab.comparisonActive = true;
        $scope.showLineGraph = function(supp) {
            Journal.overTime(
                {userId: $scope.userId,
                    suppId: supp._id}
            )
                .success(function(data) {
                    data.forEach(function(item, index) {
                        item.name = $scope.getBenefitName(item._id);
                        if (item.name == "") {
                            item.name = "Benefit " + index;
                        }
                    });
                    $scope.overTimeList = [data]
//                    $scope.overTimeList.push(data);
                });
        };

        $scope.getBenefitName = function(benefitId) {
            for (var i = 0; i < $scope.supps.length; i++) {
                if ($scope.supps._id === benefitId) {
                    return $scope.supps[i].name;
                }
            }
            return "";
        };

        $scope.scoreAdapter = function(supps) {
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
            Journal.averages($scope.userId)
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
                    newBenefits.push(benefit);
                });
                supp.benefits = newBenefits;
            });
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
    .directive('multiLineGraph', function() {
        return {
            restrict: 'E',
            replace: false,
            scope: {data: '=chartData'},
            link: function(scope, element, attrs) {
                var items = scope.data;
                var parseDate = function(dateString) {
                    return new Date(dateString);
                };
                //stating what our range is going to be - so x min will map to 0, x max will map to width. note that we haven't yet stated what our max values will be.
//                var elWidth
                var margin = {top: 30, right: 20, bottom: 70, left: 50},
                width = 600 - margin.left - margin.right,
                    height = 300 - margin.top - margin.bottom;
//                var width = element.parent()[0].offsetWidth * .9;// + 'px'
//                var height = 0;
//                var parentHeight = element.parent()[0].offsetHeight * 0.9;
//                if (parentHeight === 0) {
//                    height = 200;//+ 'px';
//                } else {
//                    height = parentHeight;
//                }
                var x = d3.time.scale().range([0, width]);
                var y = d3.scale.linear().range([height, 0]);
                var xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(10);

                var yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(5);

                var scoreline = d3.svg.line()
                    .x(function(d) {
                        return x(d.date);
                    })
                    .y(function(d) {
                        return y(d.score);
                    });
//                var svg = d3.select(element[0])
//                    .append("svg")
//                    .attr("width", width)// + margin.left + margin.right)
//                    .append("g");

                var svg = d3.select(element[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
//                items
                var color = d3.scale.category10();
                var legendSpace = width / items.length;
                items.forEach(function(benefit, index) {
                    //  d.date = parseDate(d.date);
                    // d.score = +d.score;
                    benefit.scores.forEach(function(item) {
                        item.date = parseDate(item.date);
                        item.score = +item.score;
                    });
                    x.domain(d3.extent(benefit.scores, function(d) {
                        return d.date;
                    }));
                    y.domain([0, d3.max(benefit.scores, function(d) {
                            return d.score;
                        }) + 1]);
                    svg.append("path")
                        .attr("class", "line")
                        .style("stroke", function() {
                            return benefit.color = color(index);
                        })
                        .attr('id', ("tag" + index))
                        .attr("d", scoreline(benefit.scores));

                    svg.append("text")                                    // *******
                        .attr("x", (legendSpace / 2) + index * legendSpace) // spacing // ****
                        .attr("y", height + (margin.bottom / 2) + 5)         // *******
                        .attr("class", "legend")    // style the legend   // *******
                        .style("fill", function() { // dynamic colours    // *******
                            return benefit.color = color(index);
                        })             // *******
                        .text(benefit.name)
                        .on("click", function() {
                            var active = benefit.active ? false : true;
                            var newOpacity = active ? 0 : 1;
                            if (newOpacity === 0) {
                                console.log("fading out, fadin bruh for " + index);
                            }else{
                                console.log("new opacity is ! " + index);
                            }
                            console.log('searching for tag' + index);
                            d3.select("#tag" + index)
                                .transition().duration(100)          // ************
                                .style("opacity", newOpacity);       // ************
                            // Update whether or not the elements are active
                            benefit.active = active;
                        })
                        ;
                });
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")") //move it down to the bottom!
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                scope.$watch('data', function(newVal, oldVal) {
                    return;
                });

            }
        };
    });
             