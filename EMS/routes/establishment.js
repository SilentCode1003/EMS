const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");
var x2js = require('x2js');

var path = require('path');

var async = require("async");

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
const xmlparser = require('fast-xml-parser');
var convert = require('xml-js');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('establishment', { title: 'Equipment Monitoring System' });
});

module.exports = router;

router.post('/save', function(req, res, next) {
  console.log('Received data');

  console.log(req.body);
  //#region Establishment Info
    //Xml Details
    const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
      .ele('EstablistmentInfo')
        .ele('StoreCode').txt(req.body.storecode).up()
        .ele('StoreName').txt(req.body.storename).up()
        .ele('StoreAddress').txt(req.body.storeaddress).up()
        .ele('StoreEmail').txt(req.body.storeemail).up()
        .ele('StoreArea').txt(req.body.storearea).up()
      .up();
      const xml = root.end({ prettyPrint: true });

      console.log('Create XML');

      //Write and Save xml details into XML file
      let filename = req.body.storecode+'_'+req.body.storename+'.xml';
      let fullFileName = __dirname + '/data/establishment/'+ filename;
      fs.writeFileSync(fullFileName, xml, function(err) {
      if (err) throw err;
        res.json({
          msg: 'error',
          data: err
        });
      });
    //#endregion

    //#region Report Info
    const rootInfo = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('ReportInfo')
      .ele('StoreName').txt(req.body.storecode + ' ' + req.body.storename).up()
      .ele('First').txt().up()
      .ele('Second').txt().up()
      .ele('Third').txt().up()
    .up();
    const xmlInfo = rootInfo.end({ prettyPrint: true });

    console.log('Create XML');

    //Write and Save xml details into XML file
    let filenameInfo = req.body.storecode+'_'+req.body.storename+'_report'+'.xml';
    let fullFileNameInfo = __dirname + '/data/reports/'+ filenameInfo;
    fs.writeFileSync(fullFileNameInfo, xmlInfo, function(err) {
    if (err) throw err;
      res.json({
        msg: 'error',
        data: err
      });
    });
    //#endregion

    res.json({
      msg:'success'
    });
    console.log('File saved!');
});

router.post('/saveEquipmentInfo', function(req, res, next) {

  var data = req.body.data;
  //#region Establishment Info
  let filenameFinal = req.body.storename + '.json';
  let fullFileNameFinal = __dirname + '/data/storeinfo/'+ filenameFinal;
  fs.writeFileSync(fullFileNameFinal, data, function(err) {
  if (err) throw err;
    res.json({
      msg: 'writeFileSync error',
      data: err
    });
  });
  //#endregion

  res.json({
    msg:'success'
  });

  console.log('File saved!');
});

let data_arr = [];
router.get('/loadFile', function(req, res, next) {

  output(__dirname + '/data/establishment');

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
                  var data = obj['EstablistmentInfo'];

                    data_arr.push({
                      'StoreCode': data['StoreCode'],
                      'StoreName': data['StoreName'],
                      'StoreAddress': data['StoreAddress'],
                      'StoreEmail': data['StoreEmail'],
                      'StoreArea': data['StoreArea']
                    });
                });
            });

          })
        )
    });

  }

  function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(__dirname + '/data/establishment/', filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
  }

  async function output(dir){
    await getData(dir);
  }

  res.json({
    msg: 'success',
    data: data_arr
  })

  data_arr = [];
});


class EqipmentInfo{
  constructor(){

  }

  set ItemAllocation(itemallocation){
    this.itemallocation = itemallocation;
  }
  get ItemAllocation(){
    return this._itemallocation;
  }

  set ItemName(itemname){
    this.itemname = itemname;
  }
  get ItemName(){
    return this._itemname;
  }

  set ItemSerial(itemserial){
    this.itemserial = itemserial;
  }
  get ItemSerial(){
    return this._itemserial;
  }
}