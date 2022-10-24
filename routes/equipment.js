const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");

var path = require('path');


const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');


var EquipmentDirectorySpare = __dirname + '/data/equipments/spare/';
var EquipmentDirectoryDeploy = __dirname + '/data/equipments/deploy/';



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('equipment', { title: 'Equipment Monitoring System' });
});

module.exports = router;

router.post('/save', function (req, res, next) {

  //Xml Details
  const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('ItemEquipment')
    .ele('Serial').txt(req.body.serial).up()
    .ele('ItemName').txt(req.body.itemname).up()
    .ele('DateReceive').txt(req.body.datereceive).up()
    .ele('ItemType').txt(req.body.itemtype).up()
    .ele('DeployTo').txt().up()
    .ele('DeployDate').txt().up()
    .ele('Ticket').txt().up()
    .ele('Personel').txt().up()
    .up();
  const xml = root.end({ prettyPrint: true });

  //Write and Save xml details into XML file
  let filename = req.body.serial + '_' + req.body.itemname + '.xml';
  let fullFileName = `${EquipmentDirectorySpare}${filename}`;
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

router.post('/updateFile', function (req, res, next) {
  var filename = req.body.filename;

  console.log('/updateFile: ' + filename);
  xmlFileToJs(filename, function (err, obj) {
    if (err) {
      res.json({
        msg: 'error',
        data: err
      });
    }
    var data = obj['ItemEquipment'];
    console.log(data);

    //Xml Details
    const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
      .ele('ItemEquipment')
      .ele('Serial').txt(data['Serial']).up()
      .ele('ItemName').txt(data['ItemName']).up()
      .ele('DateReceive').txt(data['DateReceive']).up()
      .ele('ItemType').txt(data['ItemType']).up()
      .ele('DeployTo').txt(req.body.deployto).up()
      .ele('DeployDate').txt(req.body.datedeploy).up()
      .ele('Ticket').txt(req.body.ticket).up()
      .ele('Personel').txt(req.body.personel).up()
      .up();
    const xml = root.end({ prettyPrint: true });
    console.log(xml);

    //Write and Save xml details into XML file
    let fullFileName = EquipmentDirectorySpare + filename;

    fs.writeFileSync(fullFileName, xml, function (err) {
      if (err) throw err;
      res.json({
        msg: 'error',
        data: err
      });
    });

    // var source = fs.createReadStream(EquipmentDirectorySpare + filename);
    // var dest = fs.createWriteStream(EquipmentDirectoryDeploy + filename);

    // source.pipe(dest);
    // source.on('end', function () { /* copied */ console.log('File moved to deploy folder...'); });
    // source.on('error', function (err) { /* error */ throw err;});

    fs.renameSync(EquipmentDirectorySpare + filename, EquipmentDirectoryDeploy + filename);
    console.log(`Moved ${EquipmentDirectorySpare + filename} to ${EquipmentDirectoryDeploy + filename}`);


    res.json({
      msg: 'success'
    });
  });

  //#region xmlFileToJs
  function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(EquipmentDirectorySpare, filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
  }
  //#endregion 
});

router.get('/loadFile', function (req, res, next) {
  var data_arr = [];

  fs.readdir(EquipmentDirectorySpare, (err, files) => {
    if (err) {
      res.json({
        msg: 'error',
        data: err
      });
    }

    files.forEach(file => {
      data_arr.push({
        'file': file
      });
    });
  });

  setTimeout(function () {
    res.json({
      msg: 'success',
      data: data_arr
    });
  }, 1000);

});

router.post('/searchFile', function (req, res, next) {
  var data_arr = [];
  var serial = req.body.serial;

  console.log(serial);

  fs.readdir(EquipmentDirectorySpare, (err, files) => {
    if (err) {
      res.json({
        msg: 'error',
        data: err
      });
    }

    files.forEach(file => {
      console.log(file);
      if(file.includes(serial)){
        data_arr.push({
          'file': file
        });
      }
    });
  });

  setTimeout(function () {
    res.json({
      msg: 'success',
      data: data_arr
    });
  }, 1000);

});

router.post('/retrieveFile', function (req, res, next) {

  var data_arr = [];
  var file = req.body.serial;
  var status = req.body.status;

  console.log(file)

  if (status == 'spare') {
    xmlFileToJs(file, function (err, obj) {
      if (err) {
        res.json({
          msg: 'error',
          data: err
        });
      }

      var data = obj['ItemEquipment'];
      data_arr.push({
        'Serial': data['Serial'],
        'ItemName': data['ItemName'],
        'DateReceive': data['DateReceive'],
        'ItemType': data['ItemType'],
        'DeployTo': data['DeployTo'],
        'DeployDate': data['DeployDate'],
        'Ticket': data['Ticket'],
        'Personel': data['Personel']
      });
    });

    function xmlFileToJs(filename, cb) {
      var filepath = path.normalize(path.join(EquipmentDirectorySpare, filename));
      fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
      });
    }
  }

  if (status == 'deploy') {
    xmlFileToJs(file, function (err, obj) {
      if (err) {
        res.json({
          msg: 'error',
          data: err
        });
      }

      var data = obj['ItemEquipment'];
      data_arr.push({
        'Serial': data['Serial'],
        'ItemName': data['ItemName'],
        'DateReceive': data['DateReceive'],
        'ItemType': data['ItemType'],
        'DeployTo': data['DeployTo'],
        'DeployDate': data['DeployDate'],
        'Ticket': data['Ticket'],
        'Personel': data['Personel']
      });
    });

    function xmlFileToJs(filename, cb) {
      var filepath = path.normalize(path.join(EquipmentDirectoryDeploy, filename));
      fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
      });
    }
  }



  setTimeout(function () {
    res.json({
      msg: 'success',
      data: data_arr
    });
  }, 1000);

 
});

router.get('/readXML', function (req, res, next) {
  let equipmentData = new EquipmentModel();

  var dir = EquipmentDirectorySpare;
  fs.readdir(dir, (err, files) => {
    if (err) {
      res.json({
        msg: 'error',
        data: err
      });
    }

    res.json({
      msg: 'success',
      data: files
    });
    // files.forEach(file => {

    // });
  });

  // xmlFileToJs(req.body.filename, function (err, obj) {
  //   if (err){
  //     res.json({
  //       msg: 'error',
  //       data: err
  //     });
  //   }

  //   var data = obj['ItemEquipment'];

  //   equipmentData.ItemName = data['ItemName'];
  //   equipmentData.ItemType = data['ItemType'];
  //   equipmentData.DateReceive = data['DateReceive'];
  //   equipmentData.Serial = data['Serial'];
  // });

  // function xmlFileToJs(filename, cb) {
  //   var filepath = path.normalize(path.join(__dirname + '/data/equipments/', filename));
  //   fs.readFile(filepath, 'utf8', function (err, xmlStr) {
  //       if (err) throw (err);
  //       xml2js.parseString(xmlStr, {}, cb);
  //   });
  // }

});


class EquipmentModel {
  constructor() {

  }

  set ItemName(itemname) {
    this.itemname = itemname;
  }
  get ItemName() {
    return this._itemname;
  }

  set ItemType(itemtype) {
    this.itemtype = itemtype;
  }
  get ItemType() {
    return this._itemtype;
  }

  set Serial(serial) {
    this.serial = serial;
  }
  get Serial() {
    return this._serial;
  }

  set DateReceive(datereceive) {
    this.datereceive = datereceive;
  }
  get DateReceive() {
    return this._datereceive;
  }
}