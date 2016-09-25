(function() {

    //d3.csv sends an HTTP GET request using resource_url provided from the template.
    d3.csv(resource_url, function(error, data) {
    addMiscElements();
    drawChart(mungeData(data));
    });

}());