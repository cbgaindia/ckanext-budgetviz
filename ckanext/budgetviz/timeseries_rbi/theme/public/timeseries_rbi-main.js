"use strict";

ckan.module('groupbarchart-view', function($, _) {
    return {
        initialize: function() {

            function mungeData(data) {
                var parseDate = d3.time.format("%Y").parse;
                var chdata = [];
                for (var i = 0; i < data.length; i++) {
                    var key = Object.keys(data[i])
                    key.shift();
                    var state = new Object();
                    state.key = data[i].States
                    state.disabled = data[i].States == "All States" ? false : true
                    var values_arr = []
                    for (var j = 0; j < key.length; j++) {
                        if (data[i][key[j]] == "...") {
                            continue;
                        } else {
                            var temp = new Object();
                            temp.x = parseDate(key[j].substring(0, 4));
                            temp.y = parseFloat(data[i][key[j]])
                            values_arr.push(temp);
                        }
                    }
                    state.values = values_arr
                    chdata.push(state);
                }
                return chdata;
            }

            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }


            var addMiscElements = function() {
                d3.select("#viz-header").text(toTitleCase(resource.name));
            }

            function drawChart(data) {
                nv.addGraph(function() {
                    var chart = nv.models.lineWithFocusChart();

                    chart.showLegend(true)
                    var xScale = d3.time.scale();
                    var mini, max;
                    var minmax;
                    chart.xScale;

                    chart.margin({ "left": 90, "right": 20, "top": 0, "bottom": 50 })

                    chart.xAxis
                        .tickFormat(function(d) {
                            return d3.time.format('%Y')(new Date(d))
                        }).axisLabel("Year");
                    chart.x2Axis.height("200px")
                        .tickFormat(function(d) {
                            return d3.time.format('%Y')(new Date(d))
                        });
                    chart.legend.margin({ top: 10, right: 0, left: -20, bottom: 40 })
                    chart.yAxis.axisLabel(resource.name + "(Rs. Crore)")
                    chart.focusHeight(120);
                    chart.focusMargin({ "top": 30 });
                    chart.pointSize(10)
                    chart.yAxis.axisLabelDistance(20)
                    chart.legendPosition("top");
                    chart.legend.align("center")
                        //chart.legend.padding(30)
                    chart.useInteractiveGuideline(true);
                    var chartdata = d3.select('#chart svg')
                        .datum(data)
                        .call(chart);

                     chartdata.transition().duration(500).call(chart);
                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            }

            d3.csv(resource_url, function(error, data) {
                addMiscElements();
                drawChart(mungeData(data));
            });
        }()
    };
});
