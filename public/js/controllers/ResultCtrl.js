"use strict";
angular.module('ResultCtrl', [])
    .controller('ResultController', function($scope, Supps, Journal) {
//        $scope.supps = [
//            {name: "Fish Oil",
//                benefits: [
//                ]}];
        $scope.supps = [
            {name: "Fish Oil",
                benefits: [
                    {name: "benefit 1 ",
                        score: 30},
                    {name: "benefit 2 ",
                        score: 50},
                    {name: "ben 3",
                        score: 20}
                ]}
        ];
//        $scope.supps
        var asBenefit = function(benefit) {
            return {_id: benefit._id,
                score: benefit.avgScore};
        };
        $scope.testCall = function() {
            Journal.averages(2)
                .success(function(data) {
//                    $scope.supps[0].benefits = [];
//                    console.log("ahhh ");
//                    $scope.supps[0].benefits = {};
                    var newBenefits = [{benefitId: 2,
                            name: "oh, god",
                            score: 10}];
                    $scope.supps[0].benefits = newBenefits;
                    return;
                    data.forEach(function(ben) {
                        $scope.supps[0].benefits.push(asBenefit(ben));
                    });
                });
        };
    })
    .directive('barsChart', function($parse) {
        //based on this: 
        ////http://codepen.io/odiseo42/pen/bCwkv
        return {
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
                var chart = d3.select(element[0])
                    .append("div").attr("class", "chart");

//                var barGraph = chart
//                    .selectAll('div')
//                    .data(scope.data);
//
//                barGraph.enter()
//                    .append("div")
//                    .transition().ease("elastic")
//                    .style("width", function(d) {
//                        return d.score + "%";
//                    })
//                    .text(function(d) {
//                        return d.name + "%";
//                    });
                    
                scope.$watch('data', function(newVal, oldVal) {
                    var barGraph = chart
                        .selectAll('div')
                        .data(newVal);

                    barGraph.enter()
                        .append("div")
                        .transition().ease("elastic")
                        .style("width", function(d) {
                            return d.score + "%";
                        })
                        .text(function(d) {
                            return d.name + "%";
                        });

                    barGraph
                        .transition().ease("elastic")
                        .style("width", function(d) {
                            return d.score + "%";
                        })
                        .text(function(d) {
                            return d.name + "%";
                        });
                        
                    barGraph
                        .exit()
                        .remove();
                });






            }
        };
    });