

console.log("sadasdass")

"use strict";

ckan.module('timeseries_ipfs-main', function ($, _) {
  return {
    initialize: function () {

    //d3.csv sends an HTTP GET request using resource_url provided from the template.
    d3.csv(resource_url, function(error, data) {
    	console.log(data);


    	var mungeData = function(data) {
        var parseDate = d3.time.format("%Y").parse;
        var mndata = [];
        var partaicular, values_arr, temp, key;
        for (i = 0; i < data.length; i += 1) {
            key = Object.keys(data[i]);
            key.shift();
            particular = Object.create(null);
            particular.key = data[i].Particulars;
            particular.type = data[i].Particulars.substring(data[i].Particulars.indexOf("(") + 1, data[i].Particulars.indexOf(")"));
            values_arr = [];

            for (j = 0; j < key.length; j += 1) {
                temp = Object.create(null);
                temp.x = parseDate(key[j].substring(0, 4));
                temp.y = parseFloat(data[i][key[j]]);

                values_arr.push(temp);

            }
            particular.values = values_arr;

            mndata.push(particular);
        }

        return mndata;
        };
        //Find possible selection categories. 
        var getSelections = function(mndata) {
        var types = new Set();
        for (i = 0; i < mndata.length; i += 1) {

            types.add(mndata[i].type);
        }
        selection = mndata[0].type;
        return Array.from(types);
        };

        //Get Stream data for selected selection.
        var getStreamData = function(mndata, selection) {
        selected_data = [];

        for (j = 0; j < mndata.length; j += 1) {
            if (mndata[j].type == selection) {

                selected_data.push(mndata[j]);
            }

        }

        return selected_data;
        };


        function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        }


        var addMiscElements = function() {
        d3.select("#viz-header").text(toTitleCase(resource.name));
        };


        var drawchart = function(data, selection) {

        nv.addGraph(function() {
            var xScale = d3.time.scale();
            var mini, max;
            var minmax;
            var formatdate = d3.time.format("%Y").parse;

            chart = nv.models.lineWithFocusChart()
                .color(["#002A4A", "#FF9311", "#D64700", "#17607D"]);

            chart.showLegend(true);
            chart.xAxis.tickFormat(function(d) {
                    return d3.time.format('%Y')(new Date(d));
            }).axisLabel("Year");

            chart.x2Axis.height("200px")
                .tickFormat(function(d) {
                    return d3.time.format('%Y')(new Date(d));
                });

            chart.yAxis.axisLabel(selection);
            chart.focusHeight(100);
            chart.pointSize(10);
            chart.brushExtent([formatdate("1952"), formatdate("2012")]);
            chart.useInteractiveGuideline(true);


            chartdata = d3.select('#chart svg')
                .datum(data)
                .call(chart);
            chart.dispatch.on("stateChange", function(e) {

            });

            chartdata.transition().duration(500).call(chart);
            nv.utils.windowResize(chart.update);
            return chart;

        });

        };

        var populateSelection = function(data, selectionList) {
        var select = d3.select("body").select("div.scheme-select")
            .append("select")
            .attr("class", "form-control select-picker")
            .attr("id", "scheme-select")
            .on("change", function() {
                var selection = d3.select("#scheme-select").property("value");

                drawchart(getStreamData(data, selection), selection);
            });

        select
            .selectAll("option")
            .data(selectionList)
            .enter().append("option")
            .attr("class", "options")
            .attr("value", function(d) {
                return d;
            })
            .text(function(d) {
                return d;
            })
            .style("margin", "0px 0px 0px 0px");

        };



        mungeddata = mungeData(data)
        selections = getSelections(mungeddata);
        addMiscElements();
        populateSelection(mungeddata, selections);
        drawchart(getStreamData(mungeddata, selections[0]), selections[0]);
    });

}()
  };
});



