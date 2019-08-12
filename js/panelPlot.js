var PanelPlots = {}

function PanelHeatmap(div, title, xSize, ySize, inputData, options = {}) {
    
    let stride = xSize;
    let data2d = [];
    for (let i = 0; i < inputData.length; i += stride) {
        data2d.push(inputData.slice(i, i + stride));
    }

    if(typeof PanelPlots[div] === "undefined") {
        let data = {
            z: data2d,
            type: 'heatmap',
            colorscale: 'Viridis'
        };

        let layout = {
            height: 600,
            xaxis: {
                automargin: true
            },
            yaxis: {
                autorange: 'reversed',
                automargin: true,
                scaleanchor: "x",
            },
            title: {
                text: title
            }
        };

        if (options.zmin) {
            data.zmin = options.zmin;
        }
        if (options.zmax) {
            data.zmax = options.zmax;
        }

        PanelPlots[div] = Plotly.newPlot(div, [data], layout, { responsive: true});
    } else {

        let update = {
            z: [data2d]
        };
        Plotly.restyle(div, update);
    }
}

function PanelScatter(div, title, xDatasets, yDatasets, xSize, ySize) {

    let data = [];
    console.assert(xDatasets.length == yDatasets.length)

    for(let i=0; i< xDatasets.length; i++)
    {
        data.push({
            x: xDatasets[i],
            y: yDatasets[i],
            type: 'scatter',
            mode: 'markers'
        })
    }

    if (typeof PanelPlots[div] === "undefined") {

        let layout;
        if (xSize && ySize) {
            layout = {
                height: 600,
                xaxis: {
                    range: [0, xSize],
                    automargin: true
                },
                yaxis: {
                    range: [ySize, 0],
                    automargin: true,
                    scaleanchor: "x",
                },
                title: {
                    text: title
                },
                hovermode: "closest"
            };
        } else {
            layout = {
                height: 600,
                xaxis: {
                    autorange: true,
                    automargin: true
                },
                yaxis: {
                    autorange: "reverse",
                    automargin: true,
                    scaleanchor: "x",
                },
                title: {
                    text: title
                },
                hovermode: "closest"
            };
        }


        PanelPlots[div] = Plotly.newPlot(div, data, layout, { responsive: true });
    } else {

        let update = {
            x: xDatasets,
            y: yDatasets
        };

        Plotly.restyle(div, update);
    }
}
