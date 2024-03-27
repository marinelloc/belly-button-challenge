// Belly Button Biodiversity Dashboard

// Set background color to white
document.body.style.backgroundColor = 'white';

// Define URL for JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data and log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard
function init() {

    // Select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Populate the dropdown selector with sample names
    d3.json(url).then((data) => {
        
        // Get sample names
        let sampleNames = data.names;

        // Add samples to dropdown menu
        sampleNames.forEach((id) => {
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the default sample
        let defaultSample = sampleNames[0];

        // Build initial plots
        buildMetadata(defaultSample);
        buildBarChart(defaultSample);
        buildBubbleChart(defaultSample);
    });
};

// Populate metadata info
function buildMetadata(sample) {

    // Retrieve all data
    d3.json(url).then((data) => {

        // Retrieve metadata
        let metadata = data.metadata;

        // Filter metadata based on sample
        let sampleMetadata = metadata.filter(result => result.id == sample)[0];

        // Clear metadata panel
        d3.select("#sample-metadata").html("");

        // Add each key/value pair to the panel
        Object.entries(sampleMetadata).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Build the bar chart
function buildBarChart(sample) {

    // Retrieve all data
    d3.json(url).then((data) => {

        // Retrieve sample data
        let samples = data.samples;

        // Filter sample data based on sample
        let sampleData = samples.filter(result => result.id == sample)[0];

        // Extract necessary data for the bar chart
        let otuIds = sampleData.otu_ids;
        let otuLabels = sampleData.otu_labels;
        let sampleValues = sampleData.sample_values;

        // Select top ten items to display in descending order
        let yTicks = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xTicks = sampleValues.slice(0,10).reverse();
        let labels = otuLabels.slice(0,10).reverse();
        
        // Define trace for the bar chart
        let trace = {
            x: xTicks,
            y: yTicks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Define layout for the bar chart
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Build the bubble chart
function buildBubbleChart(sample) {

    // Retrieve all data
    d3.json(url).then((data) => {
        
        // Retrieve sample data
        let samples = data.samples;

        // Filter sample data based on sample
        let sampleData = samples.filter(result => result.id == sample)[0];

        // Extract necessary data for the bubble chart
        let otuIds = sampleData.otu_ids;
        let otuLabels = sampleData.otu_labels;
        let sampleValues = sampleData.sample_values;
        
        // Define trace for the bubble chart
        let trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            }
        };

        // Define layout for the bubble chart
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Plot the bubble chart
        Plotly.newPlot("bubble", [trace], layout)
    });
};

// Update dashboard when sample is changed
function updateDashboard(sample) { 

    // Update metadata, bar chart, and bubble chart
    buildMetadata(sample);
    buildBarChart(sample);
    buildBubbleChart(sample);
};

// Call the initialize function
init();