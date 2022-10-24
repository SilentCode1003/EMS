const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");

var path = require('path');

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var date = require('date-and-time');


/* GET home page. */
router.get('/', function (req, res, next) {

  let now = new Date();
  let value = date.format(now, 'YYYY-MM-DD');

  let preparedBy = 'JOSEPH A. ORENCIO';
  let position = 'IT Field Engineer';
  let underscore = '________________________';
  let title = 'Equipment Monitoring System';
  let reportTitle = 'EQUIPMENT PULLOUT / RETURN';

  res.render('EquipmentPullout', {
    title: title,
    date: value,
    preparedBy: preparedBy,
    position: position,
    underscore: underscore,
    reportTitle: reportTitle
  });

  console.log({
    title,
    value,
    preparedBy,
    reportTitle
  });
});

module.exports = router;

router.post('/save', function (req, res, next) {
  var status = 'Active';
  var targetDir = '/data/pullout/equipment/active/';
  var ticket = req.body.ticket;
  var store = req.body.fromstore;
  var itemname = req.body.itemname;
  var itemserial = req.body.itemserial;
  var pulloutdate = req.body.datepullout;
  var pulloutby = req.body.pulloutby;

  //Xml Details
  const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('EquipmentPulloutInfo')
    .ele('Ticket').txt(ticket).up()
    .ele('Store').txt(store).up()
    .ele('ItemName').txt(itemname).up()
    .ele('ItemSerial').txt(itemserial).up()
    .ele('PulloutDate').txt(pulloutdate).up()
    .ele('PulloutBy').txt(pulloutby).up()
    .ele('Status').txt(status).up()
    .up();
  const xml = root.end({ prettyPrint: true });
  console.log(xml);
  //Write and Save xml details into XML file
  let filename = store + '_' + itemname + '_' + itemserial + '.xml';
  let fullFileName = __dirname + targetDir + filename;
  console.log(filename);
  console.log(fullFileName);
  fs.writeFileSync(fullFileName, xml, function (err) {
    if (err) throw err;
    res.json({
      msg: 'error',
      data: err
    });
  });
  console.log('File saved!');
  res.json({
    msg: 'success'
  });

});


router.get('/LoadData', function (req, res, next) {
  let dartaArr = [];
  var targetDir = '/data/pullout/equipment/active/';
  var retrieveFilesDir = '/data/pullout/equipment/active';
  var targetPath = __dirname + retrieveFilesDir

  console.log(targetPath);
  output(targetPath);

  async function getData(fullpath) {
    return new Promise(resolve => {
      resolve(

        fs.readdir(fullpath, function (err, files) {
          if (err) {
            res.json({
              msg: err
            });
          }

          console.log(files);


          files.forEach(file => {
            //Read each files in targetDir
            xmlFileToJs(file, (err, obj) => {
              if (err) {
                res.json({
                  msg: 'error',
                  data: err
                });
              }

              var data = obj['EquipmentPulloutInfo'];

              dartaArr.push({
                'Ticket': data['Ticket'],
                'Store': data['Store'],
                'ItemName': data['ItemName'],
                'ItemSerial': data['ItemSerial'],
                'PulloutDate': data['PulloutDate'],
                'PulloutBy': data['PulloutBy'],
                'Status': data['Status']
              });
            });
          });

        })
      )
    });

  }

  function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(__dirname + targetDir, filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
  }

  async function output(dir) {
    await getData(dir);
  }

  setTimeout(function () {
    res.json({
      msg: 'success',
      data: dartaArr
    })
  }, 1000);

});