"use strict";
angular.module('ResultCtrl', ['nvd3'])
    .controller('ResultController', function($scope, Supps, Journal) {
        $scope.supps = [];
        $scope.userId = 2;
        $scope.overTimeList = [];
        $scope.tab = {};
        $scope.tab.comparisonActive = true;
        $scope.formattedBenefits = [];
        $scope.barOptions = {
            chart: {
                "type": "multiBarHorizontalChart",
                "height": 200,
                x: function(d) {
                    return d.description;
                },
                y: function(d) {
                    return (d.score / 5) * 100;
                },
                margin: {
                    left: 200
                },
                "showControls": false,
                "showValues": true,
                "transitionDuration": 500,
                "xAxis": {
                    "showMaxMin": true
                },
                "yAxis": {
                    "axisLabel": "Average Scores"
                }}

        };
        $scope.lineOptions = {
            chart: {
                type: 'cumulativeLineChart',
                height: 300,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d) {
                    return d[0];
                },
                y: function(d) {
                    return d[1] / 100;
                },
                average: function(d) {
                    return d.mean / 100;
                },
                color: d3.scale.category10().range(),
                transitionDuration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%m/%d/%y')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d) {
                        return d3.format(',.1%')(d);
                    },
                    axisLabelDistance: 20
                }
            }
        };
//        d3.
//            .selectAll('text')
//            .each(function(d, i) {
//                insertLinebreaks(this, d, x1.rangeBand() * 2);
//            });

        $scope.insertLinebreaks = function(d) {
            var el = d3.select(this);
            var words = d.split(" ");
            el.text('');

            for (var i = 0; i < words.length; i++) {
                var tspan = el.append('tspan').text(words[i]);
                if (i > 0)
                    tspan.attr('x', 0).attr('dy', '15');
            }
        };
        $scope.updateLabels = function() {
            d3.selectAll('.nv-axisMaxMin').each($scope.insertLinebreaks);

        };
//        $scope.insertLinebreaks = function(textElement, content, width) {
//            var el = d3.select(textElement);
//            var p = d3.select(textElement.parentNode);
//            p.append("foreignObject")
//                .attr('x', -width / 2)
//                .attr("width", width)
//                .attr("height", 200)
//                .append("xhtml:p")
//                .attr('style', 'word-wrap: break-word; text-align:center;')
//                .html(content);
//
//            el.remove();
//
//        };
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
        $scope.updateBenefits = function(suppList) {
            suppList.forEach(function(supp) {
                $scope.formattedBenefits.push({
                    key: supp.name,
                    values: supp.benefits
                });
            });

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
            $scope.updateBenefits($scope.supps);

        };
    });
             