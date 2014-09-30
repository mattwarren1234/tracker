"use strict";
angular.module('ResultCtrl', ['nvd3'])
    .controller('ResultController', function($scope, Supps, Journal) {
        $scope.supps = [];
        $scope.userId = 2;
        $scope.overTimeData = [];
        $scope.tab = {};
        $scope.tab.comparisonActive = true;
        $scope.formattedBenefits = [];
        $scope.lineChartActive = false;
        $scope.lineOptions = {
            chart: {
                type: 'lineChart',
                height: 300,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 80
                },
                x: function(d) {
                    return new Date(d.date);
                },
                y: function(d) {
                    return $scope.scoreAsPercent(d.score);
                },
                color: d3.scale.category10().range(),
                transitionDuration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,
                xAxis: {
                    axisLabel: 'Scores over Time',
                    tickFormat: function(d) {
                        return d3.time.format('%m/%d/%y')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },
                yAxis: {
                    axisLabel: 'Score (%)',
                    tickFormat: function(d) {
                        return d + "%";
                        return d3.format('%')(d);
                    },
                    showMaxMin: false,
                }
            }
        };
        $scope.scoreAsPercent = function(score) {
            //score range : 1..5
            //Covert 1..5 rating to percentage rating.
            return (score / 5) * 100;
        }

        $scope.barOptions = {
            chart: {
                "type": "multiBarHorizontalChart",
                "height": 200,
                x: function(d) {
                    return d.description;
                },
                y: function(d) {
                    return $scope.scoreAsPercent(d.score);
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
                    "axisLabel": "Average Scores",
                    tickFormat: function(d) {
                        return d + "%";
                    }
                }}

        };

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
        $scope.overTimeAdapter = function(item) {
            var formattedData = [];
            item.forEach(function(current) {
                formattedData.push(
                    {
                        key: current.name,
                        values: current.scores
                    }
                );
            });
            return formattedData;
        }
        $scope.showLineGraph = function(supp) {
            $scope.lineChartActive = true;
            var benefitIds = supp.benefits.map(function(benefit) {
                console.log("benefit id " + benefit._id);
                return benefit._id;
            });
            Journal.overTime(
                {userId: $scope.userId,
                    benefitIds: benefitIds}
            )
                .success(function(data) {
                    data.forEach(function(item, index) {
                        item.name = $scope.getBenefitName(item._id);
                        if (item.name == "") {
                            item.name = "Benefit " + index;
                        }
                    });
                    $scope.overTimeData = [data];
                    $scope.overTime = $scope.overTimeAdapter($scope.overTimeData[0]);
                });
        };

        $scope.getBenefitName = function(benefitId) {
            for (var i = 0; i < $scope.supps.length; i++) {
                var benefits = $scope.supps[i].benefits;
                for (var j = 0; j < benefits.length; j++) {
                    if (benefits[j]._id === benefitId) {
                        return benefits[j].description;
                    }
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
        $scope.journalValue = function(benefitId, journalEntries) {
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
                    var newScore = $scope.journalValue(benefit._id, journalEntries);
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
             