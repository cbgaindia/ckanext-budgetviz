"use strict";

ckan.module('timeseries_ipfs-main', function($, _) {
    return {
        initialize: function() {
            d3.csv(resource_url, function(error, data) {

                var mungeData = function(data) {

                    var tempDataObject = [];
                    for (var i = 0; i < data.length; i++) {
                        var key = Object.keys(data[i])
                        key.shift();
                        var particular = new Object();
                        particular.key = data[i].Particulars
                        particular.type = data[i].Particulars.substring(data[i].Particulars.indexOf("(") + 1, data[i].Particulars.indexOf(")"));
                        var values_arr = []
                        for (var j = 0; j < key.length; j++) {
                            var temp = new Object();

                            temp.x = parseInt(key[j].substring(0, 4));

                            temp.y = parseFloat(data[i][key[j]])
                            values_arr.push(temp);
                        }
                        particular.values = values_arr
                        tempDataObject.push(particular);
                    }
                    return tempDataObject;
                }

                //Find possible selection categories. 
                var getSelections = function(tempDataObject) {
                    var types = new Set();
                    for (var i = 0; i < tempDataObject.length; i += 1) {
                        types.add(tempDataObject[i].type);
                    }
                    var selection = tempDataObject[0].type;
                    return Array.from(types);
                };

                var listYears = function(tempDataObject) {

                    var key = Object.keys(tempDataObject)
                    key.shift();
                    for (var j = 0; j < key.length; j++) {
                        key[j] = (key[j].substring(0, 4));
                    }
                    return key;

                }

                //Get Stream data for selected selection.
                var getStreamData = function(tempDataObject, selection) {
                    var selected_data = [];
                    for (var j = 0; j < tempDataObject.length; j += 1) {
                        if (tempDataObject[j].type == selection) {
                            selected_data.push(tempDataObject[j]);
                        }
                    }
                    return selected_data;
                };

                function toTitleCase(str) {
                    return str.replace(/\w\S*/g, function(txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                }

                var formatNumber = d3.format(".1f"),
                    formatCrore = function(x) {
                        return formatNumber(x / 1e7) + "Cr";
                    },
                    formatLakh = function(x) {
                        return formatNumber(x / 1e5) + "L";
                    },
                    formatThousand = function(x) {
                        return formatNumber(x / 1e3) + "k";
                    },
                    formatLowerDenom = function(x) {
                        return x;
                    };

                function formatAbbr(x) {
                    var v = Math.abs(x);
                    return (v >= .9995e7 ? formatCrore : v >= .9995e5 ? formatLakh : v >= .999e3 ? formatThousand : formatLowerDenom)(x);
                }



                var drawchart = function(data, selection, year_list) {
                    nv.addGraph(function() {

                        var chart = nv.models.lineWithFocusChart()
                            .color(["#002A4A", "#FF9800", "#d64700", "#40627C", "#B1E001", "#B1E001"])
                            .margin({ "left": 95, "right": 35, "top": 10, "bottom": 10 })
                            .showLegend(true);

                        chart.x(function(d) {
                                return d.x;
                            })
                            .y(function(d) {
                                return d.y;
                            });

                        chart.xAxis
                            .tickFormat(function(d) {
                                var c = parseInt(d) + 1;
                                return String(d) + " - " + String(c)
                            })
                            .axisLabel("Year")
                            .axisLabelDistance(20);

                        chart.x2Axis.height("200px")
                            .tickFormat(function(d) {
                                var c = parseInt(d) + 1;
                                return String(d) + " - " + String(c)
                            });

                        chart.yAxis.axisLabel(selection)
                            .axisLabelDistance(20)
                            .tickFormat(function(d) {
                                return formatAbbr(d)
                            });

                        chart.y(function(d) {
                            return parseFloat(d.y)
                        });

                        chart.tooltip.valueFormatter(function(d) {
                                return d3.format(",.f")(d);
                            })
                            .headerFormatter(function(d) {
                                var c = parseInt(d) + 1;
                                return String(d) + " - " + String(c)
                            });
                        //` chart.brushExtent([year_list[parseInt(year_list.length/10)], year_list[year_list.length - 1]]);

                        chart.focusHeight(150)
                            .focusMargin({ "top": 50 })
                            .pointSize(10)
                            .clipEdge(false);

                        var chartdata = d3.select('#chart svg')
                            .datum(data)
                            .call(chart);

                        chartdata.transition().duration(500).call(chart);
                        nv.utils.windowResize(chart.update);
                        return chart;
                    });
                };

                var populateSelection = function(data, selectionList) {
                    var select = d3.select("body").select("div.option-select")
                        .append("div")
                        .attr("class", "btn-group");

                    var select_buttons = select
                        .selectAll("button")
                        .data(selectionList)
                        .enter().append("button");

                    select_buttons
                        .attr("value", function(d) {
                            return d;
                        })
                        .attr("class", function(d, i) {
                            if (i == 0) {
                                return "active";
                            }
                        })
                        .classed("btn visbtn", true)
                        .text(function(d) {
                            return d;
                        })
                        .on("click", function(d, i) {
                            drawchart(getStreamData(data, d), d, listYears(data[0]));
                            select_buttons.classed("active", function(d, i) {
                                return !d3.select(this).classed("active");
                            });
                        });
                }

                var mungedData = mungeData(data);
                var selections = getSelections(mungedData);
                populateSelection(mungedData, selections);
                drawchart(getStreamData(mungedData, selections[0]), selections[0], listYears(data[0]));
            });
        }()
    };
});