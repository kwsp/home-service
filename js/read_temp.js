let dataStruct = struct("<If");

let dataFrame = {
   fileNavigator: {},
   time: 0,
   temperature: 0
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

   dataFrame.fileNavigator = new LineNavigator(file)
   dataFrame.numFrames=0;
   let frameID = 0;
   letmissingPackets=0;

   dataFrame.fileNavigator.readLines(0, 1, function linesReadHandler(err, index, lines, isEof, progress) {

	if (err) {
		$('current_data').html(err);
		throw err;
	}
	$('#current_data').html('Loading: ${progress}%');
	
	frameData = parseDataLine(lines[0]);
	$('#current_data').html(frameData);


   });

}


$('#button').onclick('click', function (e) {
	readDataFile();
});
