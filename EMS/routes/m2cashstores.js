const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");

var path = require('path');

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var targetDir = '/data/m2cash/stores/';
var targetPath = '/data/m2cash/stores';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('m2cashstores', { title: 'Equipment Monitoring System' });
});

module.exports = router;

router.post('/save', function (req, res, next) {
  var storename = req.body.storename;
  var address = req.body.address;
  var area = req.body.area;
  var googleaddress = req.body.googleaddress;

  //Xml Details
  const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('M2CashStore')
    .ele('StoreName').txt(storename).up()
    .ele('Address').txt(address).up()
    .ele('GoogleAddress').txt(googleaddress).up()
    .ele('Area').txt(area).up()
    .up();
  const xml = root.end({ prettyPrint: true });
  console.log(xml);
  //Write and Save xml details into XML file
  let filename = storename + '_' + area + '.xml';
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
    msg: 'File saved!'
  });
});


router.get('/LodaData', function (req, res, next) {
  let data_arr = [];
  output(__dirname + targetPath);

  async function getData(fullpath) {
    return new Promise(resolve => {
      resolve(

        fs.readdir(fullpath, function (err, files) {
          if (err) {
            res.json({
              msg: err
            });
          }


          files.forEach(file => {
            xmlFileToJs(file,
              (err, obj) => {
                if (err) {
                  res.json({
                    msg: 'error',
                    data: err
                  });
                }
                var data = obj['M2CashStore'];

                data_arr.push({
                  'StoreName': data['StoreName'],
                  'Address': data['Address'],
                  'GoogleAddress': data['GoogleAddress'],
                  'Area': data['Area']
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
  
  setTimeout(() => {
    res.json({
      msg: 'success',
      data: data_arr
    })
  }, 1000);
});