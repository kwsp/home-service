const fs = require('fs');
const atob = require('atob');
const moment = require('moment');
const struct = require('./struct.js').struct;


const dataStruct = struct("<IfI");

// Parse a single base64 ecoded line of data
function parseDataLine(line) {
   var data = {
     time: 0,
     temperature: 0,
     activity: 0,
   }
   let binary_string = atob(line);
   let bytes = new Uint8Array(dataStruct.size);
   for (let i = 0; i < dataStruct.size; i++) {
      bytes[i] = binary_string.charCodeAt(i);
   }
   [data.time, data.temperature, data.activity] = dataStruct.unpack_from(bytes.buffer, 0);   
   data.time = moment(data.time*1000).format('MM/DD/YY HH:mm')
   data.temperature = Number.parseFloat(data.temperature).toPrecision(4);
   return data;
}

// Parse one base64 encoded .txt file
async function parseFile (file) {
   return new Promise(resolve => {
      let parsedLine;
      let sensorData = {
         time: [],
         temperature: [],
         activity: [],
      };
     
      // const label = `read2-${file}`;
      // console.time(label);
      const stream = fs.createReadStream(file, {encoding: 'utf-8'});
       // create the data scream
      stream.on('data', data => {
         data.split(/\n/).forEach(function (item, index) {
             // parse each line
            // parse every 20th line :) decimation!
            if (index % 20 == 0) {
               data = parseDataLine(item);
               sensorData.time.push(data.time);
               sensorData.temperature.push(data.temperature);
               sensorData.activity.push(data.activity);
            }
         });
         stream.destroy();
      });
      stream.on('close', () => {
         // console.timeEnd(label);
         resolve(sensorData);
      })
   });
}


async function parseFiles(file) {
      console.log(file);
      let sensorData = await parseFile(file);
      console.log(sensorData)
}


const listDir = source =>
   fs.readdirSync(source)
      .filter(file => /\d+\.txt/.test(file))
      .map(el => 'data/' + el);

// var data_dir = __dirname + '/data';
// console.log(listDir(data_dir));


const listDataDir = () =>
   fs.readdirSync(__dirname.concat('/data'))
      .filter(file => /\d+\.txt/.test(file))
      .map(el => 'data/' + el);


const getNewestDataFile = () =>
   fs.readdirSync(__dirname.concat('/data'))
      .filter(file => /\d+\.txt/.test(file))
      .map(el => 'data/' + el)
      .sort().slice(-1)[0];


var filePath = getNewestDataFile()
console.log(filePath)


module.exports = {
   listDataDir: listDataDir,
   getNewestDataFile: getNewestDataFile,
   parseFile: parseFile,
}
