const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");

var path = require('path');

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var targetDir = '/data/m2cash/equipment/';
var targetPath = '/data/m2cash/equipment';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('m2cashequipment', { title: 'Equipment Monitoring System', fullname: req.session.fullname });
});

module.exports = router;

router.post('/save', function(req, res, next) {
  var status = 'ONHAND';
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


router.get('/LodaData', function(req, res, next) {
  let data_arr = [];
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

  setTimeout(function () {
    res.json({
      msg: 'success',
      data: data_arr
    });
  }, 1000);
});

router.post('/Update',function(req, res, next){
  var filename = req.body.filename;
  var datedeploy = req.body.datedeploy;
  var personel = req.body.personel;
  var status = req.body.status;

  xmlFileToJs(filename, function (err, obj) {
    if (err){
      res.json({
        msg: 'error',
        data: err
      });
    }
    var data = obj['M2CashDeviceInfo'];
    console.log(data);

    //Xml Details
    const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('M2CashDeviceInfo')
      .ele('StoreName').txt(data['StoreName']).up()
      .ele('Address').txt(data['Address']).up()
      .ele('Area').txt(data['Area']).up()
      .ele('DeviceNumber').txt(data['DeviceNumber']).up()
      .ele('PortType').txt(data['PortType']).up()
      .ele('DeviceAdaptor').txt(data['DeviceAdaptor']).up()
      .ele('CableType').txt(data['CableType']).up()
      .ele('Modem').txt(data['Modem']).up()
      .ele('ModemSerial').txt(data['ModemSerial']).up()
      .ele('SIMCard').txt(data['SIMCard']).up()
      .ele('ModemAdaptor').txt(data['ModemAdaptor']).up()
      .ele('PatchCable').txt(data['PatchCable']).up()
      .ele('DateDeploy').txt(datedeploy).up()
      .ele('Personel').txt(personel).up()
      .ele('Status').txt(status).up()
    .up();
    const xml = root.end({ prettyPrint: true });
      console.log(xml);

      //Write and Save xml details into XML file
      let fullFileName = __dirname + targetDir + filename;

      fs.writeFileSync(fullFileName, xml, function(err) {
        if (err) throw err;
          res.json({
            msg: 'error',
            data: err
          });
        });

        res.json({
          msg:'success'
        });
  });

  //#region xmlFileToJs
    function xmlFileToJs(filename, cb) {
      var filepath = path.normalize(path.join(__dirname + targetDir, filename));
      fs.readFile(filepath, 'utf8', function (err, xmlStr) {
          if (err) throw (err);
          xml2js.parseString(xmlStr, {}, cb);
      });
    }
  //#endregion 

});