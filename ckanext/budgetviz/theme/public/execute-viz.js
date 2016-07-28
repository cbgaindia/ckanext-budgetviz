(function() {
      var resource_url = "{{ h.view_resource_url(resource_view, resource, package) }}";
	//This will be changed in integration. D3.csv will be replaced by a function to get data and initialise the plot.
    d3.csv(resource_url, function(error, data) {
        console.log("data")
        
        //Temporary calls. Will be replaced.
        mungeddata=getmungeData(data)
        selections=getSelections(mungeddata);
        addMiscElements();
        populateSelection(mungeddata,selections);
        drawchart(getStreamData(mungeddata,selections[0]),selections[0]);
    });




}());
