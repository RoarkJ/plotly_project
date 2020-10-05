function selectBiodiv() {
    var cellData = d3.select("#selDataset")
    d3.json("samples.json").then((data)=>{
        data.names.forEach((name)=>{
            cellData.append("option")
            .text(name).property("value")
        });
        console.log(data.names);
        optionChanged(data.names[0]);
    });
};


function selectMetaData(subject) {
    d3.json("samples.json").then((data)=>{
        var selection = data.metadata;
        var filteredSel = selection.filter(md=>md.id == subject);
        var firstSubject = filteredSel[0];
        console.log(firstSubject);
        var starterData = d3.select("#sample-metadata");
        //clear list
        starterData.html("");
        Object.entries(firstSubject).forEach(([key, value])=> {
            starterData.append("p").text(`${key}: ${value}`)
        });
    });
};

function optionChanged(subject) {
    selectMetaData(subject)
    plotData(subject)
    plotBubble(subject)
};

function plotData(subject) {
    d3.json("samples.json").then((data)=> {
        var samples = data.samples;
        var sampSel = samples.filter(samplesObj=>samplesObj.id == subject);
        var firstSample = sampSel[0];
        console.log(firstSample);

        var trace = {
            type: "bar",
            orientation: "h",
            x: firstSample.sample_values.slice(0, 10).reverse(),
            y: firstSample.otu_ids.map(id => `otu_id ${id}`).slice(0, 10).reverse(),
            text: firstSample.otu_labels.slice(0, 10).reverse()
        };
        var bar_data = [trace];

        var layout = {
            xaxis: {title: "otu_ids"}
        };
        Plotly.newPlot("bar", bar_data, layout);
    });

}

function plotBubble(subject) {
    d3.json("samples.json").then((data)=> {
        var samples = data.samples;
        var sampSel = samples.filter(samplesObj=>samplesObj.id == subject); 
        var firstSample = sampSel[0];
        console.log(firstSample);

        var trace = {
            type: "scatter",
            x: firstSample.otu_ids,
            y: firstSample.sample_values,
            mode: "markers",
            text: firstSample.otu_labels,
            marker: {
                colorscale: "Earth",
                color: firstSample.otu_ids,
                size: firstSample.sample_values.map((sample) => sample/1.5)
            }
        };
        var bubble_data = [trace];

        var layout = {
            xaxis: {title: "OTU_ID"}
        };

        Plotly.newPlot("bubble", bubble_data, layout);
    });
}

selectBiodiv();

