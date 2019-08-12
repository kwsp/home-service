
let dataStruct = struct("<If");

let dataFrame = {
   fileNavigator: {},
   time: 0,
   temperature: 0
};

let tempData = {
   time: [],
   temperature: []
};


function parseDataLine(line) {
   let data = {}
   let binary_string = window.atob(line);
   let bytes = new Uint8Array(dataFrame.size);
   for (let i = 0; i < dataFrame.size; i++) {
      bytes[i] = binary_string.charCodeAt(i);
   }
   [data.time, data.temperature] = dataStruct.unpack_from(bytes.buffer, 0);
   return data;
}

function readDataFile(e) {
   let file = e.target.files[0];
   if (!file) {
      $('#current_data').html("not a valid file");
      return;
   }

   dataFrame.fileNavigator = new LineNavigator(file, { chunkSize: 32768, throwOnLongLines: true });
   dataFrame.numFrames=0;
   let frameID = 0;
   letmissingPackets=0;

   dataFrame.fileNavigator.readLines(0, 1, function linesReadHandler(err, index, lines, isEof, progress) {

	if (err) {
		$('current_data').html(err);
		throw err;
	}
	$('#current_data').html(`Loading: ${progress}%`);


   // End of file
   if (isEof) {

      if (missingPackets > 0) {
          $('#frame-warnings').html(`Missing ${missingPackets} Packets`);
      } else {
          $('#frame-warnings').html("");
      }
      frameEntryMaxFrames(dataFrame.numFrames);
      frameEntryAddFunction(function (x) {
          parseDataFrame(x, plotDataFramePlots);
      });
      return;
   }

	frameData = parseDataLine(lines[0]);
	$('#current_data').html(frameData);

   });

}

$('#button').click('click', function (e) {
	// readDataFile();
});

var trace1 = {
    type: 'line',
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16],
    name: 'line plot',
    // mode: 'lines',
    marker: {
        color: '#C8A2C8',
        line: {
            width: 2.5
        }
    }
};

var data = [ trace1 ];

var layout = {
  title: "Bla!",
  font: {size: 18},
  showLegend: true
};



Plotly.newPlot('temperature_plot', data, layout, {responsive: true, scrollZoom: true});


var years = ['2014', '2015', '2016']

Plotly.d3.csv('../data/test.csv', (err, rows) => {
  var data = timestamp.map(y => {
    var d = rows.filter(r => r.timestamp === y)

    return {
      type: 'line',
      name: y,
      x: d.map(r => r.timestamp),
      y: d.map(r => r.val)
    }
  })

  Plotly.newPlot('graph', data, {scrollZoom: true})
})
