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
                    state.disabled = data[i].States == "All-States" ? false : true
                    var values_arr = []
                    for (var j = 0; j < key.length; j++) {
                        if (data[i][key[j]] == "..." || data[i][key[j]] == "-") {
                            continue;
                        } else {
                            var temp = new Object();
                            temp.x = parseInt(key[j].substring(0, 4));
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

            function remove_notes(data) {
                var regex = /[a-zA-Z]/i;
                var data_length = data.length
                for (var i = 0, j = 0; j < data_length; j++) {
                    if (!(regex.test(data[i]["States"][0]))) {
                        data.splice(i, 1)
                    } else {
                        i++;
                    }
                }
                for (var i = 0; i < data.length; i++) {
                }
                return data
            }

            function prepareData(data) {
                return mungeData(remove_notes(data))
            }

            function drawChart(data) {
                nv.addGraph(function() {
                    var chart = nv.models.lineWithFocusChart();
                    var xScale = d3.time.scale();
                    var mini, max;
                    var minmax;
                    chart.xScale;

                    chart.x(function(d) {
                            return d.x
                        })
                        .y(function(d) {
                            return parseFloat(d.y)
                        })
                        .margin({ "left": 90, "right": 40, "top": 0, "bottom": 50 })
                        .focusHeight(120)
                        .focusMargin({ "top": 30 })
                        .pointSize(10)
                        .showLegend(true)
                        .legendPosition("top")
                        .focusMargin({ "top": 20 })
                        .clipEdge(false);

                    chart.xAxis
                        .tickFormat(function(d) {
                            var c = parseInt(d) + 1;
                            return String(d) + " - " + String(c)
                        }).axisLabel("Year")
                        .axisLabelDistance(20);
                    chart.x2Axis.height("200px")
                        .tickFormat(function(d) {
                            var c = parseInt(d) + 1;
                            return String(d) + " - " + String(c)
                        });

                    chart.legend.margin({ top: 10, right: 0, left: -20, bottom: 40 })
                        .align("center");

                    chart.yAxis.axisLabel(resource.name + "(Rs. Crore)")
                        .axisLabelDistance(20);

                    chart.tooltip.valueFormatter(function(d) {
                            return d3.format(",.f")(d);
                        })
                        .headerFormatter(function(d) {
                            var c = parseInt(d) + 1;
                            return String(d) + " - " + String(c)
                        })

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
                drawChart(prepareData(data));
            });
        }()
    };
});