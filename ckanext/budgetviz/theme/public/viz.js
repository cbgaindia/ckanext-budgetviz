    //Prepare data for Timeseries
    var getmungeData = function(data) {

        var parseDate = d3.time.format("%Y").parse;

        var mndata = [];
        for (var i = 0; i < data.length; i++)

        {
            key = Object.keys(data[i])
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

            mndata.push(particular);
        }
        return mndata;
    }
    //Find possible selection options
    var getSelections = function(mndata) {
        var types = new Set()
        for (var i = 0; i < mndata.length; i++) {

            types.add(mndata[i].type);
        }
        selection = mndata[0].type;
        return Array.from(types);
    }

    //Get Stream data for selected selection.
    var getStreamData = function(mndata,selection) {
        selected_data = []

        for (var j = 0; j < mndata.length; j++) {
            if (mndata[j].type == selection) {

                selected_data.push(mndata[j])
            }

        }

        return selected_data;
    }


    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    var addMiscElements = function() {
        d3.select("#viz-header").text(toTitleCase("BUDGETARY DEFICIT OF THE CENTRE AND THE STATES"))
    }


    var drawchart = function(data, selection) {

        console.log(selection)
        nv.addGraph(function() {
            chart = nv.models.lineWithFocusChart()
                .color(["#002A4A", "#FF9311", "#D64700", "#17607D"]);

            chart.showLegend(true)
            var xScale = d3.time.scale();
            var mini, max;
            var minmax;
            chart.xScale;

            chart.xAxis
                .tickFormat(function(d) {
                    return d3.time.format('%Y')(new Date(d))
                }).axisLabel("Year");
            chart.x2Axis.height("200px")
                .tickFormat(function(d) {
                    return d3.time.format('%Y')(new Date(d))
                });

            chart.yAxis.axisLabel(selection)
            chart.focusHeight(100)
            chart.pointSize(10)

            chart.useInteractiveGuideline(true);
            chartdata = d3.select('#chart svg')
                .datum(data)
                .call(chart);
            chart.dispatch.on("stateChange", function(e) {

            });

            chartdata.transition().duration(500).call(chart);
            nv.utils.windowResize(chart.update);
            return chart;
            console.log(data)
        });

    };

    var populateSelection = function(data,selectionList) {
        var select = d3.select("body").select("div.scheme-select")
            .append("select")
            .attr("class", "form-control select-picker")
            .attr("id", "scheme-select")
            .on("change", function() {
                var selection = d3.select("#scheme-select").property("value");
                console.log(selection)
                drawchart(getStreamData(data,selection), selection)
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

    }

