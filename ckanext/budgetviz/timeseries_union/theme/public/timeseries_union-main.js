"use strict";

ckan.module('timeseries_ipfs-main', function($, _) {
    return {
        initialize: function() {
            d3.json(resource_url, function(data) {
                function clickcall() {
                    return false;
                }
                var unit, note;

                function get_unit() {
                    var extra_fields = package_details.extras

                    for (var i in extra_fields) {

                        if (extra_fields[i].key == "Unit") {
                            unit = extra_fields[i].value;
                        }
                        if (extra_fields[i].key == "Note") {
                            note = extra_fields[i].value;
                        }
                    }
                }

                get_unit();

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

                function populateSelection(data) {
                    var select = d3.select("#item-select")
                        .append("ul")
                        .attr("class", "nav nav-tabs nav-stacked")
                        .selectAll("li")
                        .data(data)
                        .enter().append("li")
                        .attr("class", function(d, i) {
                            if (i == 0) {
                                return "active";
                            }
                        })
                        .on("click", function(d) {
                            drawchart(d);
                        })

                    select.append("a")
                        .attr({
                            onclick: "return false;",
                            href: "#"
                        })
                        .text(function(d) {
                            return d.name
                        })

                    $(".nav a").on("click", function() {
                        $(".nav").find(".active").removeClass("active");
                        $(this).parent().addClass("active");
                    });
                }

                var listYears = function(tempDataObject) {
                    var parseDate = d3.time.format("%Y").parse;
                    var key = Object.keys(tempDataObject)
                    key.shift();
                    for (var j = 0; j < key.length; j++) {
                        key[j] = (key[j].substring(0, 4));
                    }
                    return key;
                }

                function drawchart(data) {

                    nv.addGraph(function() {
                        var chartdata;
                        /*var maxValue = d3.max(data.series, function(d) {
                            return d3.max(d.values, function(d) {
                                return +d.value;
                            })
                        });

                        var minValue = d3.min(data.series, function(d) {
                            return d3.min(d.values, function(d) {
                                return +d.value;
                            })
                        });
                        */
                        var chart = nv.models.lineWithFocusChart()
                            .color(["#002A4A", "#FEB41C", "#D64700", "#FA9600"])
                            .x(function(d) {
                                return parseInt((d.label).substring(0, 4));
                            });

                        chart.focusHeight(120)
                            .margin({ "left": 90, "right": 90, "top": 0, "bottom": 50 })
                            .noData("The record has no values in the budget document.")
                            .focusMargin({ "top": 20 })
                            .useInteractiveGuideline(false)
                            .showXAxis(true)
                            .padData(false)
                            .clipEdge(false);

                        chart.yAxis.axisLabelDistance(20).tickPadding(15)
                            .ticks(10)
                            .tickFormat(function(d) {
                                return formatAbbr(d)
                            })
                            .axisLabel(data.name);

                        chart.xAxis.axisLabelDistance(0)
                            .axisLabel("Year");

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

                        chart.y(function(d) {
                            return parseFloat(d.value)
                        })

                        chart.tooltip.valueFormatter(function(d) {
                                return d3.format(",.f")(d) + " " + unit;
                            })
                            .headerFormatter(function(d) {
                                var c = parseInt(d) + 1;
                                return String(d) + " - " + String(c)
                            })
                            /*
                            if (maxValue < 0) {
                                maxValue = 0;
                            }
                            if (minValue > 0) {
                                minValue = 0;
                            }
                            chart.yDomain([minValue, maxValue]);
                            */
                            //chart.brushExtent([formatdate("2006"), formatdate("2016")]);
                        chartdata = d3.select('#chart svg')
                            .datum(data.series)
                            .call(chart);

                        /* chart.dispatch.on('brush', function(extent, brush) {
                             maxValue = d3.max(data.series.map(function(d, i) {
                                     return {
                                         key: d.key,
                                         values: d.values.filter(function(d, i) {
                                             return parseFloat(d.label.substring(0, 4)) >= parseFloat(extent.extent[0]) && parseFloat(d.label.substring(0, 4)) <= parseFloat(extent.extent[1]);
                                         }),
                                     }
                                 }),
                                 function(d) {
                          
                                     return d3.max(d.values, function(d) {
                                         return +d.value;
                                     })
                                 })

                             minValue = d3.min(data.series.map(function(d, i) {
                                 return {
                                     key: d.key,
                                     values: d.values.filter(function(d, i) {
                                         return parseFloat(d.label.substring(0, 4)) >= parseFloat(extent.extent[0]) && parseFloat(d.label.substring(0, 4)) <= parseFloat(extent.extent[1]);
                                     }),
                                 }
                             }), function(d) {
                                 return d3.min(d.values, function(d) {
                                     return +d.value;
                                 })
                             });

                             if (maxValue < 0) {
                                 maxValue = 0;
                             }
                             if (minValue > 0) {
                                 minValue = 0;
                             }
                             chart.yDomain([minValue, maxValue]);
                             chart.update;
                         });
                         */
                        chartdata.transition().duration(500).call(chart);
                        nv.utils.windowResize(chart.update);
                        return chart;
                    });
                }



                function add_notes() {
                    try {

                        if (unit) {
                            d3.select(".notes-content")
                                .text(function(d) {
                                    return unit;
                                })
                            d3.select(".notes-heading")
                                .text(function(d) {
                                    return "Figures are in : ";
                                })
                        }
                        if (note) {
                            d3.select(".unit-note-content")
                                .text(function(d) {
                                    return note;
                                })
                            d3.select(".unit-note-heading")
                                .text(function(d) {
                                    return "Note :";
                                })
                        }
                    } catch (err) {}

                }
                add_notes();
                populateSelection(data);

                drawchart(data[0])
            });
        }()
    };
});
