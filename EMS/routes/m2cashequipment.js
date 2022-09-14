const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");

var path = require('path');

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('m2cashequipment', { title: 'Equipment Monitoring System' });
});

module.exports = router;

router.post('/save', function(req, res, next) {
  var status = 'ONHAND';
  var targetDir = '/data/m2cash/equipment/';
  var storename = req.body.storename;
  var address = req.body.address;
  var area = req.body.area;
  var devicenum = req.body.devicenum;
  var porttype = req.body.porttype;
  var deviceadaptor = req.body.deviceadaptor;
  var cabletype = req.body.cabletype;
  var modem = req.body.modem;
  var modemserial = req.body.modemserial;
  var simcard = req.body.simcard;
  var modemadaptor = req.body.modemadaptor;
  var patchcable = req.body.patchcable;

  //Xml Details
  const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('M2CashDeviceInfo')
      .ele('StoreName').txt(storename).up()
      .ele('Address').txt(address).up()
      .ele('Area').txt(area).up()
      .ele('DeviceNumber').txt(devicenum).up()
      .ele('PortType').txt(porttype).up()
      .ele('DeviceAdaptor').txt(deviceadaptor).up()
      .ele('CableType').txt(cabletype).up()
      .ele('Modem').txt(modem).up()
      .ele('ModemSerial').txt(modemserial).up()
      .ele('SIMCard').txt(simcard).up()
      .ele('ModemAdaptor').txt(modemadaptor).up()
      .ele('PatchCable').txt(patchcable).up()
      .ele('DateDeploy').txt().up()
      .ele('Personel').txt().up()
      .ele('Status').txt(status).up()
    .up();
    const xml = root.end({ prettyPrint: true });
    console.log(xml);
    //Write and Save xml details into XML file
    let filename = storename + '_' + devicenum + '_' + modemserial +'.xml';
    let fullFileName = __dirname + targetDir + filename;
    console.log(filename);
    console.log(fullFileName);
    fs.writeFileSync(fullFileName, xml, function(err) {
    if (err) throw err;
      res.json({
        msg: 'error',
        data: err
      });
    });

    console.log('File saved!');
    
    res.json({
      msg:'File saved!'
    });
});

let data_arr = [];
router.get('/LodaData', function(req, res, next) {
  var targetDir = '/data/m2cash/equipment/';
  var targetPath = '/data/m2cash/equipment';

  output(__dirname + targetPath);

  async function getData(fullpath){
    return new Promise(resolve => {
        resolve(

          fs.readdir(fullpath, function(err, files){
            if(err){
              res.json({
                msg: err
              });
            }


            files.forEach(file => {
                xmlFileToJs(file,
                  (err, obj) => {
                  if (err){
                    res.json({
                      msg: 'error',
                      data: err
                    });
                  }
                  var data = obj['M2CashDeviceInfo'];

                    data_arr.push({
                      'StoreName': data['StoreName'],
                      'Address': data['Address'],
                      'Area': data['Area'],
                      'DeviceNumber': data['DeviceNumber'],
                      'PortType': data['PortType'],
                      'DeviceAdaptor': data['DeviceAdaptor'],
                      'CableType': data['CableType'],
                      'Modem': data['Modem'],
                      'ModemSerial': data['ModemSerial'],
                      'SIMCard': data['SIMCard'],
                      'ModemAdaptor': data['ModemAdaptor'],
                      'PatchCable': data['PatchCable'],
                      'DateDeploy': data['DateDeploy'],
                      'Personel': data['Personel'],
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

  async function output(dir){
    await getData(dir);
  }

  console.log(data_arr);
  res.json({
    msg: 'success',
    data: data_arr
  })

  data_arr = [];
});