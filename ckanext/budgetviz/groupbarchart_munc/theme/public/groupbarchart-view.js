d3.json(resource_url, function(data) {




    addMiscElements();
    populateSelection(data);
    drawchart(data[0])
});
