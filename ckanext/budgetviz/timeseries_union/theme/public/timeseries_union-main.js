"use strict";

ckan.module('timeseries_ipfs-main', function($, _) {
    return {
        initialize: function() {
            d3.json(resource_url, function(data) {
                function clickcall() {
                    return false;
                }

                function populateSelection(data) {
                    var select = d3.select("#item-select")
                        .append("ul")
                        .attr("class", "nav nav-tabs nav-stacked")
                        .selectAll("li")
                        .data(data)
                        .enter().append("li")
                        .attr("class", function(d, i) {
                            if(i==0){
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

                function drawchart(data) {
                    nv.addGraph(function() {
                        var chartdata;
                        var maxValue = d3.max(data.series, function(d) {
                            return d3.max(d.values, function(d) {
                                return +d.value;
                            })
                        });

                        var minValue = d3.min(data.series, function(d) {
                            return d3.min(d.values, function(d) {
                                return d.value;
                            })
                        });

                        var chart = nv.models.lineWithFocusChart()
                            .color(["#002A4A", "#FF9311", "#D64700", "#17607D"])
                            .x(function(d) {
                                return parseInt((d.label).substring(0, 4));
                            })
                            .y(function(d) {
                                return parseFloat(d.value)
                            });
                        chart.focusHeight(110);
                        chart.margin({ "left": 90, "right": 20, "top": 0, "bottom": 50 })
                        chart.yAxis.axisLabelDistance(30)
                        chart.xAxis.axisLabelDistance(20)
                        chart.yAxis.ticks(10)
                        chart.focusMargin({ "top": 20 });
                        chart.yAxis
                            .tickFormat(d3.format(',.1f'));
                        chart.useInteractiveGuideline(true);
                        chart.tooltip.contentGenerator(function (obj) { return JSON.stringify(obj)});
                        chart.xAxis.axisLabel("Year");
                        chart.yAxis.axisLabel(data.name);
                        //chart.brushExtent([formatdate("2006"), formatdate("2016")]);
                        chartdata = d3.select('#chart svg')
                            .datum(data.series)
                            .call(chart);

                        chartdata.transition().duration(500).call(chart);
                        nv.utils.windowResize(chart.update);
                        return chart;
                    });
                }

                function add_notes() {
                try {

                    var extra_fields = package_details.extras
                    var unit, note;
                    for (var i in extra_fields) {
                        console.log(extra_fields[i]);
                        if (extra_fields[i].key == "Unit") {
                            unit = extra_fields[i].value;
                        }
                        if (extra_fields[i].key == "Note") {
                            note = extra_fields[i].value;
                        }
                    }
                    if (note) {
                        d3.select(".notes-content")
                            .text(function(d) {
                                return unit;
                            })
                        d3.select(".notes-heading")
                            .text(function(d) {
                                return "Unit :";
                            })
                    }
                    if (unit) {
                        d3.select(".unit-note-content")
                            .text(function(d) {
                                return note;
                            })
                        d3.select(".unit-note-heading")
                            .text(function(d) {
                                return "Note :";
                            })
                    }

                }
             catch (err) {}

        }
                add_notes();
                populateSelection(data);
                drawchart(data[0])
            });
        }()
    };
});
