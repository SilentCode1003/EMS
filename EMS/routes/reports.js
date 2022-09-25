const fs = require('fs');
var express = require('express');
var router = express.Router();
// var List = require("collections/list");

var path = require('path');

var async = require("async");

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('reports', { title: 'Equipment Monitoring System'});
});

module.exports = router;


router.get('/loadFile', function(req, res, next) {
  let data_arr = [];
  output(__dirname + '/data/reports');
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
                  var data = obj['ReportInfo'];
                  
                    data_arr.push({
                      'StoreName': data['StoreName'],
                      'First': data['First'],
                      'Second': data['Second'],
                      'Third': data['Third']
                    });
                }); 
            });

          })
        )
    });

  }

  function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(__dirname + '/data/reports/', filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
  }

  async function output(dir){
    await getData(dir);
  }

  setTimeout(() => {
    res.json({
      msg: 'success',
      data: data_arr
    })
  }, 1000);
});

router.post('/retrieveFile', function(req, res, next) {
  var file = req.body.filename;
  console.log(file)

  var filepath = path.normalize(path.join(__dirname + '/data/storeinfo/', file + '.json'));
  fs.readFile(filepath, 'utf8', function (err, jsStr) {
    if (err){
      res.json({
        msg:'error',
        data: err
      })
    }

    var data = JSON.parse(jsStr)
    console.log(data);
    res.json({
      msg:'success',
      data: data
    })

  });
});

router.post('/save', function(req, res, next) {
  var file = req.body.filename;
  var storename = req.body.storename;
  var assignto = req.body.assignto;
  var dateperform = req.body.dateperform;
  var quarter = req.body.quarter;

  console.log(file);

  xmlFileToJs(file, (err, obj) => {
    if (err){
      res.json({
        msg: 'error',
        data: err
      });
    }
    var data = obj['ReportInfo'];
      //#region XML file update

      //PM QUARTER REPORT XML
      const rootInfo = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
      .ele('ReportInfo')
        .ele('StoreName').txt(req.body.storename).up()
        .ele('First').txt(quarter == 'First' ? dateperform : data['First']).up()
        .ele('Second').txt(quarter == 'Second' ? dateperform : data['Second']).up()
        .ele('Third').txt(quarter == 'Third' ? dateperform : data['Third']).up()
      .up();
      const xmlInfo = rootInfo.end({ prettyPrint: true });

      console.log('Create XML \n' + xmlInfo);

      //Write and Save xml details into XML file
      let filenameInfo = file;
      let fullFileNameInfo = __dirname + '/data/reports/'+ filenameInfo;
      fs.writeFileSync(fullFileNameInfo, xmlInfo, function(err) {
      if (err) throw err;
        res.json({
          msg: 'error',
          data: err
        });
      });

      //PM QUARTER REPORT XML
      const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
      .ele('PMReportLog')
        .ele('StoreName').txt(req.body.storename).up()
        .ele('AssignTo').txt(assignto).up()
        .ele('DatePerform').txt(dateperform).up()
        .ele('Quarter').txt(quarter).up()
      .up();
      const xml = root.end({ prettyPrint: true });

      console.log('Create XML \n' + xml);

      //Write and Save xml details into XML file
      let filenameLog = storename + '_' + assignto + '_' + dateperform+ '.xml';
      let fullFileNameLog = __dirname + '/data/pmreportlog/'+ filenameLog;
      fs.writeFileSync(fullFileNameLog, xml, function(err) {
      if (err) throw err;
        res.json({
          msg: 'error',
          data: err
        });
      });
      //#endregion
      
      res.json({
        msg: 'success'
      })
    });


  //xmlFileToJs function
  function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(__dirname + '/data/reports/', filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
  }
});