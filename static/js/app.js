
// set default name id
let current_id='940';


//Use the D3 library to read in samples.json
d3.json("./samples.json").then(function(data) {

//insert name ids into drop-down menu
data.names.forEach(element => {
    d3.select("#selDataset")
    .append("option")
    .text(element)
    .property("value",element); 
}); 

plotbar(data, current_id);
plotbubble(data, current_id);
put_metadata(data, current_id);

  });



function optionChanged(current_id) {
    //plot new data if another entry is chosen
    current_id=current_id ;
    console.log(current_id);
    d3.json("./samples.json").then(function(data) { plotbar(data, current_id); put_metadata(data, current_id); plotbubble(data, current_id) });     
 }

function put_metadata(data, current_id) {
    //insert sample metadata into the panel
    let demographic_info= d3.select("#sample-metadata");
    let metadata1=data.metadata.filter(x=> x.id == current_id)[0];
    
    demographic_info.html("");
    Object.entries(metadata1).forEach(([key, value])=>{demographic_info.append("h5").text(`${key}: ${value}`); });

}

function plotbar(data, current_id) {
// Create a horizontal bar chart with a dropdown menu to display the 
// top 10 OTUs found in that individual.

// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.

// filter data samples for current id
let current_sample=data.samples.filter(x => x.id === current_id )[0];

//create array for sorting
let triple=[];
for (var i=0; i< current_sample.sample_values.length; i++ ) {
triple.push([current_sample.sample_values[i],'OTU '+current_sample.otu_ids[i],current_sample.otu_labels[i] ]);
}

// sort array over sample_values and reverse it in descending order 
triple.sort((firstNum, secondNum) => firstNum[0] - secondNum[0]).reverse();

// Take 10 samples with biggest values and reverse it in ascending order
let triple_slice = triple.slice(0, 10).reverse();

// traspose array to extract X, Y and otu labels
sample_chunk=triple_slice[0].map((_, colIndex) => triple_slice.map(row => row[colIndex]));



let trace1 = {
    x: sample_chunk[0],
    y: sample_chunk[1],
    text: sample_chunk[2],
    type: 'bar',
    orientation: 'h',
    name:"bar"
  };


  let plotdata = [trace1];

  Plotly.newPlot("bar", plotdata);
}

function plotbubble(data, current_id){

    let current_sample=data.samples.filter(x => x.id === current_id )[0];

    let trace1 = {
        x: current_sample.otu_ids,
        y: current_sample.sample_values,
        text: current_sample.otu_labels,
        type: 'scatter',
        mode: 'markers',
        name:"bubble",
        marker: { size: current_sample.sample_values, color: current_sample.otu_ids }
      };
    
    
      let plotdata = [trace1];
    
      Plotly.newPlot("bubble", plotdata);
}

