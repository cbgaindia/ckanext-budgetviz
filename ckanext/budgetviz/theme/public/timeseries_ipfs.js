(function() {

    //d3.csv sends an HTTP GET request using resource_url provided from the template.
    d3.csv(resource_url, function(error, data) {
       console.log(data)

       
        mungeddata = mungeData(data)
        selections = getSelections(mungeddata);
        addMiscElements();
        populateSelection(mungeddata, selections);
        drawchart(getStreamData(mungeddata, selections[0]), selections[0]);
    });

}());