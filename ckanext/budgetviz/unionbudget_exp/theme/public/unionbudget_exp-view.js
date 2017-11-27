"use strict";

ckan.module('unionbudget_exp-view', function($, _) {
    return {
        initialize: function() {
            function populate_records(data) {
                var flag = 0

                var select = d3.select("#select-list")
                    .append("ul")
                    .attr("class", "records unstyled")
                    .selectAll("li")
                    .data(data)
                    .enter()
                    .append("li")
                    .html(function(d) {
                        if (d.hasOwnProperty('series')) {
                            if (d.hasOwnProperty('key_index')) {
                                return "<i class='icon-check-empty' aria-hidden='true'></i> " + /*"<div class='record-index'>" + d.key_index + " . " + " </div>" + */ "<div class='record-name'>  " + " " + d.key + "</div>"
                            } else {
                                return "<i class='icon-check-empty' aria-hidden='true'></i> " + "<div class='record-name'>" + d.key + "</div>"
                            }
                        } else {

                            if (d["key_lvl"] == 2) {
                                return "<i class='icon-list-ul' aria-hidden='true'></i> " + "<div class='record-name'>  " + d.key + "</div>"
                            }

                            if (d['key_lvl'] == 1) {
                                return "<div class='record-name'>  " + d.key + "</div>"
                            }

                            if (d.hasOwnProperty('key_index')) {
                                return "<i class='icon-sign-blank' aria-hidden='true'></i> " /*+"<div class='record-index'>" + d.key_index  + " . " + "</div> " */ + "<div class='record-name'>  " + d.key + " </div>"
                            } else {
                                return "<i class='icon-sign-blank' aria-hidden='true'></i> " + "<div class='record-name'>  " + d.key + "</div>"
                            }
                        }
                    })
                    .attr("class", function(d, i) {
                        var class_str = "list "
                        if (d.hasOwnProperty("series") && flag == 0) {
                            flag = 1
                            class_str = class_str.concat("active ");
                            drawchart(d)
                            generate_table(d)
                            d3.select("#viz-header").text(d.key)
                        }

                        if (d.hasOwnProperty('series')) {
                            class_str = class_str.concat("series ")
                        } else {
                            class_str = class_str.concat("no-series ")
                        }

                        return class_str.concat(" nv-" + d["key_lvl"]).concat(" " + d["key_attr"])
                    })
                    .on("click", function(d) {
                        if (d.hasOwnProperty('series')) {
                            generate_table(d)
                            drawchart(d)
                            d3.select("#viz-header").text(d.key)
                        } else {
                            event.preventDefault();
                        }
                    })

                $(".records").find(".active").children("i").removeClass("icon-check-empty");
                $(".records").find(".active").children("i").addClass("icon-check-sign");

                $(".records li.series").on("click", function(d) {
                    $(".records").find(".active").children("i").removeClass("icon-check-sign");
                    $(".records").find(".active").children("i").addClass("icon-check-empty");

                    $(".records").find(".active").removeClass("active");
                    $(this).addClass("active");

                    $(this).children("i").removeClass("icon-check-empty");
                    $(this).children("i").addClass("icon-check-sign");
                });
            }

            function filter(node) {
                try {
                    return (node.getAttribute("id") !== 'download_vis');
                } catch (err) {
                    return true;
                }
            }

            function downloadImage() {
                domtoimage.toBlob(document.getElementById('visualization-area'), { filter: filter }).then(function(blob) { window.saveAs(blob, d3.select("#viz-header").text() + ".png"); });
            }

            function add_actions() {
                document.getElementById("download_vis").addEventListener("click", downloadImage, true);
                Mousetrap.bind('alt+p', function() {
                    downloadImage();
                });
            }



            function generate_table(data) {
                d3.select("#per-table").remove()

                var table = d3.select("#table-body")
                    .append("table")
                    .attr("id", "per-table")
                    .attr("class", "table")

                var thead = table.append("thead")

                var header_rw = thead.append("tr")

                header_rw.selectAll("th")
                    .data(data["series"])
                    .enter()
                    .append("th")
                    .text(function(d) {
                        return d.key
                    })
                    .attr("text-align", "center")

                header_rw.insert("th", ":first-child");

                label_set = new Set()
                for (var i in data["series"]) {
                    var obj_series = data["series"][i]["values"];
                    var keys = Object.keys(obj_series)

                    for (var j in obj_series) {
                        label_set.add(obj_series[j].label)
                    }
                }

                var label_set = Array.from(label_set);

                var tbody = table.append('tbody')

                var tabel_rows = tbody.selectAll("tr")
                    .data(label_set)
                    .enter()
                    .append("tr")

                tabel_rows.append("td")
                    .text(function(d, i) {
                        return d
                    })

                for (j in data["series"]) {
                    tabel_rows.append("td")
                        .html(function(d, i) {
                            var current_record = data["series"][j]["values"].find(function(x) {
                                if (x["label"] == d) {
                                    return true
                                }
                            })

                            if (typeof current_record != "undefined") {
                                if (i != 0) {
                                    var previous_record = data["series"][j]["values"].find(function(x) {
                                        if (x["label"] == label_set[i - 1]) {
                                            return true
                                        }
                                    })
                                    if (typeof previous_record != "undefined") {
                                        var percent_figure = ((current_record["value"] - previous_record["value"]) / previous_record["value"] * 100)
                                        return "<span class='fig-per' >" + percent_figure.toFixed(2) + " % " + "</span>" + "<span class='fig-num' >" + current_record["value"].toFixed(2) + " Cr." + "</span>"

                                    } else {
                                        return "<span class='fig-num' >" + current_record["value"].toFixed(2) + " Cr." + "</span>"
                                    }
                                } else {
                                    return "<span class='fig-num' >" + current_record["value"].toFixed(2) + " Cr." + "</span>"
                                }
                            } else {
                                return "..."
                            }
                        })
                        .style("color", function(d, i) {
                            var percent_figure;
                            var current_record = data["series"][j]["values"].find(function(x) {
                                if (x["label"] == d) {
                                    return true
                                }
                            })

                            if (typeof current_record != "undefined") {
                                if (i != 0) {
                                    var previous_record = data["series"][j]["values"].find(function(x) {
                                        if (x["label"] == label_set[i - 1]) {
                                            return true
                                        }
                                    })
                                    if (typeof previous_record != "undefined") {
                                        percent_figure = ((current_record["value"] - previous_record["value"]) / previous_record["value"] * 100)
                                    }
                                }
                            }

                            if (percent_figure > 0) {
                                return "#007622"
                            } else if (percent_figure < 0) {
                                return "#990000"
                            }
                        })
                }
            }

            function drawchart(data) {

                nv.addGraph(function() {
                    var chart = nv.models.multiBarChart()
                        .color(["#002A4A", "#FF9311", "#D64700", "#17607D"])
                        .x(function(d) { return d.label })
                        .y(function(d) { return d.value })
                        .height(350)
                        .margin({ top: 5, right: 30, bottom: 50, left: 70 })
                        .reduceXTicks(false) //If 'false', every single x-axis tick label will be rendered.
                        .rotateLabels(0) //Angle to rotate x-axis labels.
                        .showControls(false) //Allow user to switch between 'Grouped' and 'Stacked' mode.
                        .groupSpacing(0.1) //Distance between each group of bars.
                        //.staggerLabels(true)
                        .wrapLabels(true);

                    chart.yAxis.axisLabel("Rs. Crore")
                        .axisLabelDistance(7)
                        .ticks(8)
                        .tickFormat(d3.format(',.1f'));

                    var chartdata = d3.select("#chart-area svg")
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
                } catch (err) {}
            }

            d3.json(resource_url, function(data) {
                populate_records(data)
                add_actions()
                add_notes()
            });
        }()
    };
});