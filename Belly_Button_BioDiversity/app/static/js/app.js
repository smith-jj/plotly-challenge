// Belly Button Biodiversity - Plotly.js
// Build function to collect Metedata from app.py scrape of data 
function buildMetadata(sample) {
    console.log(sample);

    // @TODO: Complete the Following Function that Builds the Metadata Panel
    var PANEL = d3.select("#sample-metadata");
    // Use `d3.json` to Fetch the Metadata for a Sample
    d3.json(`/metadata/${sample}`).then((data) => {
        // Use d3 to Select the Panel with id of `#sample-metadata`

        // Use `.html("") to Clear any Existing Metadata
        PANEL.html(" ");
        // Use `Object.entries` to Add Each Key & Value Pair to the Panel
        // Hint: Inside the Loop, Use d3 to Append New Tags for Each Key-Value in the Metadata
        Object.entries(data).forEach(([key, value]) => {
                PANEL.append("h6").text(`${key}:${value}`);
            })
            // BONUS: Build the Gauge Chart
            // buildGauge(data.wfreq);
    });
}

function buildCharts(sample) {

    // @TODO: Use `d3.json` to Fetch the Sample Data for the Plots
    d3.json(`/samples/${sample}`).then((data) => {
        // @TODO: Build a Bubble Chart Using the Sample Data
        // @TODO: Build a Pie Chart
        let bubbleLayout = {
            margin: { t: 0 },
            hovermode: "closests",
            xaxis: { title: "OTU ID" }
        }

        let bubbleData = [{
            x: data.otu_ids,
            y: data.sample_values,
            text: data.otu_labels,
            mode: "markers",
            marker: {
                size: data.sample_values,
                color: data.otu_ids,
                colorscale: "Earth"
            }
        }]

        Plotly.plot("bubble", bubbleData, bubbleLayout);

        // HINT: Use slice() to Grab the Top 10 sample_values,
        // otu_ids, and otu_labels (10 Each)
        let pieData = [{
            values: data.sample_values.slice(0, 10),
            labels: data.otu_ids.slice(0, 10),
            hovertext: data.otu_labels.slice(0, 10),
            hoverinfo: "hovertext",
            type: "pie"
        }];

        let pieLayout = {
            margin: { t: 0, l: 0 }
        };

        Plotly.plot("pie", pieData, pieLayout)
    })
}

function init() {
    // Grab a Reference to the Dropdown Select Element
    var selector = d3.select("#selDataset");

    // Use the List of Sample Names to Populate the Select Options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the First Sample from the List to Build Initial Plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch New Data Each Time a New Sample is Selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the Dashboard
init();