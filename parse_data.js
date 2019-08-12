const fs = require('fs');
const util = require('util');
const atob = require('atob');
const d3 = require('d3');

const struct = require('./js/struct.js').struct;

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const dataStruct = struct("<If");

const dateFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');
const dateFormatShort = d3.timeFormat('%H:%M');
function parseDataLine(line) {
   let data = {}
   let binary_string = atob(line);
   let bytes = new Uint8Array(dataStruct.size);
   for (let i = 0; i < dataStruct.size; i++) {
      bytes[i] = binary_string.charCodeAt(i);
   }
   [data.time, data.temperature] = dataStruct.unpack_from(bytes.buffer, 0);
   data.time = dateFormat(new Date(data.time*1000));
   data.temperature = Number.parseFloat(data.temperature).toPrecision(4);
   return data;
}

async function parseFile (file) {
   return new Promise(resolve => {
      let parsedLine;
      let sensorData = {
         time: [],
         temperature: []
      };
      // const label = `read2-${file}`;
      // console.time(label);

      const stream = fs.createReadStream(file, {encoding: 'utf-8'});
      stream.on('data', data => {
         data.split(/\n/).forEach(function (item, index) {
            parsedLine = parseDataLine(item);
            if (parseInt(parsedLine.time.slice(0,4)) >= 2019 &&
                parsedLine.temperature > 0 &&
                parsedLine.temperature < 50) {
               sensorData.time.push(parsedLine.time);
               sensorData.temperature.push(parsedLine.temperature);
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
//
var filePath = getNewestDataFile()
console.log(filePath)


module.exports = {
   listDataDir: listDataDir,
   getNewestDataFile: getNewestDataFile,
   parseFile: parseFile,
}
