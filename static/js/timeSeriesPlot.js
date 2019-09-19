
function timeSeriesPlot(div, title, dataset, options={}) {
   var layout = {
      // plot_bgcolor: 'black',
      // paper_bgcolor: 'black',
      title: {
         text:title,
         font: {
            // family: 'Courier New, monospace',

            size: 24
         },
         xref: 'paper',
         x: 0.05,
         },
      xaxis: {
         autorange: true,
         title: {
            font: {
               // family: 'Courier New, monospace',
               size: 18,
               // color: '#7f7f7f'
            }
         },
         // range: ['2019-08-11 00-00-00', '2019-08-11 23-59-59'],
         rangeslider: {range: ['2019-08-11 00-00-00', '2019-08-11 23-59-59']},
         type: 'time'
         },
      yaxis: {
         title: {
            font: {
               // family: 'Courier New, monospace',
               size: 18,
               // color: '#7f7f7f'
            },
            autorange: true,
            range: [15, 30],
         }
      }
   };
   if (options.x_label) {
      layout.xaxis.title = options.x_label;
   }
   if (options.y_label) {
      layout.yaxis.title = options.y_label;
   }

   if (options.yrange) {
      layout.yaxis = {
         range: options.yrange,
      }
   }
   if (options.xrange) {
      layout.xaxis = {
         range: options.xrange,
      }
   }
   Plotly.newPlot(div, dataset, layout, {responsive: true});
}

function updatePlot(id, data) {
   var graph = $(id)[0];
   graph.data = data;
   graph.layout.xaxis.range = [];
   Plotly.redraw(graph);
   Plotly.Plots.resize(graph);
}
