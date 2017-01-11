"use strict";

ckan.module('groupbarchart-view', function($, _) {
    return {
        initialize: function() {

            var addMiscElements = function() {
                d3.select("#viz-header").text(resource.name)
            }

            function populateSelection(data) {
                var select = d3.select("#select-list")
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
                    .classed("elem", true)

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
                            return parseFloat(d.value);
                        })
                    });
                    var minValue = d3.min(data.series, function(d) {
                        return d3.min(d.values, function(d) {
                            return parseFloat(d.value);
                        })
                    });

                    var chart = nv.models.multiBarChart()
                        .color(["#002A4A", "#FF9311", "#D64700", "#17607D"])
                        .x(function(d) {
                            return d.label
                        })
                        .y(function(d) {
                            return parseFloat(d.value);
                        })
                        .reduceXTicks(false) //If 'false', every single x-axis tick label will be rendered.
                        .rotateLabels(0) //Angle to rotate x-axis labels.
                        .showControls(false) //Allow user to switch between 'Grouped' and 'Stacked' mode.
                        .groupSpacing(0.2); //Distance between each group of bars.

                    chart.yAxis.ticks(10)

                    if (maxValue < 0) {
                        maxValue = 0;
                    }
                    if (minValue > 0) {
                        minValue = 0;
                    }
                    chart.yDomain([minValue, maxValue]);

                    chart.margin({ "left": 90, "right": 20, "top": 0, "bottom": 70 })
                    chart.yAxis
                        .tickFormat(d3.format(',.1f'));

                    chart.noData("The record has no values in the budget document.");
                    chart.xAxis.axisLabel("Year");
                    chart.yAxis.axisLabel(data.name);
                    chart.yAxis.axisLabelDistance(30)
                    chart.yAxis.ticks(10)
                    chart.xAxis.axisLabelDistance(20)

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
                    if (unit) {
                        d3.select(".notes-content")
                            .text(function(d) {
                                return unit;
                            })
                        d3.select(".notes-heading")
                            .text(function(d) {
                                return "Unit :";
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

                }
             catch (err) {}

        }

            d3.json(resource_url, function(data) {
            addMiscElements();
            add_notes()
            populateSelection(data);
            drawchart(data[0])
        });
    }()
};
});
