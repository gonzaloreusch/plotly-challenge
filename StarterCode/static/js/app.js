//function makeResponsive() {
        console.log('connecting');
        function drawBarChart(sid) {        // create the function that gets the data and creates the plots for the id 
            console.log(`DrawBargraph (${sid}`)
                d3.json('samples.json').then((data) => {    // get the data from the json file
                console.log(data.samples)
                var sdata = data.samples.filter(x => x.id == sid) // filter sample values by id 
                console.log(sdata[0].otu_ids.slice(0, 10).reverse())    // get only top 10 sample values to plot and reverse for the plotly
                var trace1 = {
                    type: 'bar',
                    x: sdata[0].sample_values.slice(0, 10).reverse(),   
                    y: sdata[0].otu_ids.slice(0, 10).map(otu =>  `OTU ${otu}`).reverse(), // adding OTU to the label.
                    text: sdata[0].otu_labels.slice(0, 10), // get the top 10 labels for the plot
                    orientation: "h",
                    marker: {
                        color: '#ffbf45'
                    },
                };
                var data = [trace1];    // create data variable
                var layout = {  // create layout variable to set plots layout
                    title: `ID ${sid} Top 10`,
                    tickmode:"linear",
                    margin: {t: 0, l: 200}
                }
                Plotly.newPlot('bar', data, layout) // create the bar plot
            });
        }
        function drawBubbleChart(sid) {
            d3.json('samples.json').then((data) => {
                var sdata = data.samples; 
                var sdata = data.samples.filter(x => x.id == sid);
                //console.log(sdata[0].otu_ids); 
                var trace1 = {  // create the trace for the bubble chart
                    x: sdata[0].otu_ids,
                    y: sdata[0].sample_values,
                    mode: 'markers',
                    marker: {
                        size: sdata[0].sample_values,
                        color: sdata[0].otu_ids,
                    },
                    text: sdata[0].otu_labels
                };
                data = [trace1];
                var layout = {  // set the layout for the bubble plot
                    title: "Bacteria Cultures Sample Values by OTU",
                    xaxis:{title:"OTU ID"},
                    yaxis:{title:"Qty"},
                    showlegend: false,
                    height: 600,
                    width: 1000
                };
                Plotly.newPlot('bubble', data, layout); // create the bubble plot
            });
        }
        function demographics(sid) {
            console.log(`Show metadata ${sid}`);
            d3.json('samples.json').then((data) => {
                console.log(data.metadata);
                var metaData = data.metadata.filter(x => x.id == sid);  // get the metadata info for the demographic panel
                console.log(metaData[0]);
                var selector = d3.select("#sample-metadata")// getting the div element
                selector.html('');// clear previous content
                Object.entries(metaData[0]).forEach(([key, value]) => {
                    selector.append('h6')
                    .text(`${key}: ${value}`);
                });
            });
        }
        function gaugeChart(sid) {
            console.log(`works ${sid}`);
            d3.json('samples.json').then((data) => {
                console.log(data.metadata);
                var metaData = data.metadata.filter(x => x.id == sid);
                //checking washing frequency result
                console.log(metaData[0].wfreq);
            var data = [   //https://plotly.com/javascript/indicator/#a-single-angular-gauge-chart
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: metaData[0].wfreq,
                    title: { text: "Washing Frequency" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        steps: [//https://plotly.com/python/gauge-charts/ Add Steps,
                            {range: [0, 3], color: '#ffc517'},
                            {range: [3, 6], color: '#FA7C22'},
                            {range: [6, 9], color: '#00b5db'},
                        ],
                        axis: {range: [0, 9]},
                        bar: {color: 'white'}                    } 
                }
            ];
            var layout = { width: 500, height: 500, margin: { t: 0, b: 0 } };
            Plotly.newPlot('gauge', data, layout);
            });
        }
        function optionChanged(newsid) {
            console.log(`User select ${newsid}`)
            drawBarChart(newsid)
            drawBubbleChart(newsid)
            demographics(newsid)
            gaugeChart(newsid);
        }
        function initDashboard() {
            console.log('calling initDashboard()');
            var selector = d3.select('#selDataset');// getting the dropdownbox element by id
            d3.json('samples.json').then((data) => { // reading samples.json
                console.log(data)
                var sampleNames = data.names;
                sampleNames.forEach((sid) => {
                    selector.append('option') // creates a new element on the HTML
                        .text(sid)
                        .property('value', sid);
                });
                var sid = sampleNames[0];
                console.log('Starting sample: ', sid);
                drawBarChart(sid);
                drawBubbleChart(sid);
                demographics(sid);
                gaugeChart(sid);
            });
        }
        initDashboard();
//        }
//makeResponsive();
//d3.select(window).on("resize", makeResponsive);