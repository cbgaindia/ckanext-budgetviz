"use strict";

ckan.module('timeseries_ipfs-main', function($, _) {
    return {
        initialize: function() {
            //d3.csv sends an HTTP GET request using resource_url provided from the template.
            d3.csv(resource_url, function(error, data) {
                console.log(data[0])
                var mungeData = function(data) {
                    var parseDate = d3.time.format("%Y").parse;
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
                            temp.x = parseDate(key[j].substring(0, 4));
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

                var listYears = function(tempDataObject){
                    var parseDate = d3.time.format("%Y").parse;
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

                var drawchart = function(data, selection, year_list) {
                    nv.addGraph(function() {
                        console.log(data);
                        var formatdate = d3.time.format("%Y").parse;
                        var chart = nv.models.lineWithFocusChart()
                            .color(["#002A4A", "#FF9311", "#D64700", "#17607D"]);
                        chart.margin({ "left": 85, "right": 25, "top": 10, "bottom": 10 })
                        chart.showLegend(true);

                        chart.x(function(d) {
                                return d.x;
                            })
                            .y(function(d) {
                                return d.y;
                            })

                        chart.xAxis.tickFormat(function(d) {
                            return d3.time.format('%Y')(new Date(d));
                        }).axisLabel("Year");

                        chart.x2Axis.height("200px")
                            .tickFormat(function(d) {
                                return d3.time.format('%Y')(new Date(d));
                            });

                        chart.yAxis.axisLabel(selection);
                        chart.focusHeight(150);
                        chart.focusMargin({ "top": 50 });
                        chart.pointSize(10);
                        console.log(year_list)
                        chart.brushExtent([formatdate(year_list[parseInt(year_list.length/10)]), formatdate(year_list[year_list.length - 1])]);
                        chart.useInteractiveGuideline(true);
                        chart.yAxis.axisLabelDistance(20)

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
