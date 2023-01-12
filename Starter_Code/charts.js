function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    console.log(samplesArray)
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = samplesArray.filter(sampleObj => sampleObj.id == sample);
    console.log(filterSample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata;
    var filterMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
    console.log(filterMetadata);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var result = filterSample[0];
    console.log(result)
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = filterMetadata[0];
    console.log(firstMetadata);
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_idsArray = result.otu_ids;
    var otu_labelsArray = result.otu_labels;
    var sample_values = result.sample_values;
    console.log(otu_idsArray);
    console.log(otu_labelsArray);
    console.log(sample_values);
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washFrequency = parseFloat(firstMetadata.wfreq);
    console.log(washFrequency);
    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var topTen = otu_idsArray.slice(0,10);
    var yticks = topTen.map(x=>"OTU "+x).reverse();
    var topSamples = sample_values.slice(0,10).reverse();
    console.log(yticks);
    console.log(topSamples);
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: topSamples,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labelsArray
    }
    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: yticks,
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleTrace = [{
      x: otu_idsArray,
      y: sample_values,
      text: otu_labelsArray,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_idsArray,
        colorscale: 'Picnic'
      }
    }];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU ID" }, 

  };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x: [0, 1], y: [0, 1]},
        value: washFrequency,
        title: {text: 'Belly Button Washing Frequency <br> Scrubs per week'},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [0, 10]},
          steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "yellowgreen"},
            {range: [8, 10], color: "green"},
          ],
          bar: {color: "black"},
        }
  }];
    
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {width: 500, height: 500, margin: { t: 0, b: 0 }};
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
