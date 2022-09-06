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

let data_arr = [];
router.get('/loadFile', function(req, res, next) {
  
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

  res.json({
    msg: 'success',
    data: data_arr
  })

  data_arr = [];
});