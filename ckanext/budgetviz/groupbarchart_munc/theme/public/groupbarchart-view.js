"use strict";

ckan.module('groupbarchart-view', function ($, _) {
  return {
    initialize: function () {

		var addMiscElements = function() {
		    d3.select("#viz-header").text(("BBMP Budget Summary Statement"))
		}

		var populateSelection = function(data) {
		    var select = d3.select("#select-list")
		        .append("form")
		        .attr("role", "form")
		        .selectAll("div")
		        .data(data)
		        .enter().append("div")
		        .attr("class", "radio")
		        .on("click", function(d) {
		            drawchart(d)
		        })


		    var inner_div_select = select.append("div")
		        .attr("class", "inner-div")

		    inner_div_select
		        .append("label")
		        .attr("value", function(d) {
		            return d.name;
		        })
		        .attr("for", function(d) {
		            return d.name;
		        })
		        .text(function(d) {
		            return d.name;
		        })
		        .style("margin", "0px 0px 0px 0px");


		    inner_div_select
		        .insert("input", ":first-child")

		    .attr({
		            "name": "radio-button",
		            "type": "radio"
		        })
		        .attr("value", function(d) {
		            return d.name;
		        })
		        .attr("id", function(d) {
		            return d.name;
		        })


		    d3.select("#select-list").select("form").select("div").select("input").attr("checked", "")


		}



		function drawchart(data) {


		    nv.addGraph(function() {
		        var chart = nv.models.multiBarChart()
		            .color(["#002A4A", "#FF9311", "#D64700", "#17607D"])
		            .x(function(d) {
		                return d.label })
		            .y(function(d) {
		                return d.value })
		            .reduceXTicks(false) //If 'false', every single x-axis tick label will be rendered.

		        .rotateLabels(0) //Angle to rotate x-axis labels.
		            .showControls(false) //Allow user to switch between 'Grouped' and 'Stacked' mode.
		            .groupSpacing(0.2) //Distance between each group of bars.
		        ;
		        chart.yAxis.ticks(10)

		        chart.yAxis
		            .tickFormat(d3.format(',.1f'));

		     
		        chartdata = d3.select('#chart svg')
		            .datum(data.series)
		            .call(chart);


		        chartdata.transition().duration(500).call(chart);

		        nv.utils.windowResize(chart.update);

		        return chart;
		    });

		}





		d3.json(resource_url, function(data) {



			console.log(data)
		    addMiscElements();
		    populateSelection(data);
		    drawchart(data[0])
		});
}()
  };
});