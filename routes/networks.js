const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");

var path = require('path');

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');

var networkSpare = __dirname + '/data/network/spare/';
var networkDeploy = __dirname + '/data/network/deploy/';
var networks = __dirname + '/data/network/spare';


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('networks', { title: 'Equipment Monitoring System' , fullname: req.session.fullname});
});

module.exports = router;

router.post('/save', function (req, res, next) {
  var itemname = req.body.itemname;
  var itemserial = req.body.itemserial;
  var datereceived = req.body.datereceived;
  var receivedby = req.body.receivedby;

  //Xml Details
  const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('NetworkItemInfo')
    .ele('ItemName').txt(itemname).up()
    .ele('ItemSerial').txt(itemserial).up()
    .ele('DateReceived').txt(datereceived).up()
    .ele('ReceivedBy').txt(receivedby).up()
    .ele('DeployTo').txt().up()
    .ele('DateDeploy').txt().up()
    .ele('DeployBy').txt().up()
    .ele('Ticket').txt().up()
    .up();
  const xml = root.end({ prettyPrint: true });
  console.log(xml);

  //Write and Save xml details into XML file
  let filename = networkSpare + itemname + "_" + itemserial + '.xml';
  fs.writeFileSync(filename, xml, function (err) {
    if (err) throw err;
    res.json({
      msg: 'error',
    });
  });

  console.log('File saved: ' + filename);

  res.json({
    msg: 'success'
  });
});


router.get('/loadFile', function (req, res, next) {
  let data_arr = [];
  output(networks);

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
                var data = obj['NetworkItemInfo'];

                data_arr.push({

                  'ItemName': data['ItemName'],
                  'ItemSerial': data['ItemSerial'],
                  'DateReceived': data['DateReceived'],
                  'ReceivedBy': data['ReceivedBy'],
                  'DeployTo': data['DeployTo'],
                  'DateDeploy': data['DateDeploy'],
                  'DeployBy': data['DeployBy'],
                  'Ticket': data['Ticket']
                });
              });
          });

        })
      )
    });

  }

  function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(networkSpare, filename));
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

router.post('/updateFile', function (req, res, next) {
  var fileName = req.body.filename

  xmlFileToJs(fileName, function (err, obj) {
    if (err) {
      res.json({
        msg: 'error',
        data: err
      });
    }
    var data = obj['NetworkItemInfo'];
    console.log(data);

    //Xml Details
    const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
      .ele('NetworkItemInfo')
      .ele('ItemName').txt(data['ItemName']).up()
      .ele('ItemSerial').txt(data['ItemSerial']).up()
      .ele('DateReceived').txt(data['DateReceived']).up()
      .ele('ReceivedBy').txt(data['ReceivedBy']).up()
      .ele('DeployTo').txt(req.body.deployto).up()
      .ele('DateDeploy').txt(req.body.datedeploy).up()
      .ele('DeployBy').txt(req.body.ticket).up()
      .ele('Ticket').txt(req.body.personel).up()
      .up();
    const xml = root.end({ prettyPrint: true });
    console.log(xml);

    //Write and Save xml details into XML file
    let fullFileName = networkSpare + fileName;

    fs.writeFileSync(fullFileName, xml, function (err) {
      if (err) throw err;
      res.json({
        msg: 'error',
        data: err
      });
    });

    fs.renameSync(networkSpare + fileName, networkDeploy + fileName);
    console.log(`Moved ${networkSpare + fileName} to ${networkDeploy + fileName}`);

    res.json({
      msg: 'success'
    });
  });

  //#region xmlFileToJs
  function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(networkSpare, filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
  }
  //#endregion 
});