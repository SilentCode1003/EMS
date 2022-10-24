const fs = require('fs');
var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
const helper = require('./repository/customhelper');
const UserPath = `${__dirname}/data/accounts/`



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('account', { title: 'Equipment Monitoring System' });
});

module.exports = router;

router.post('/save', function (req, res, next) {
  try {
    var data = req.body.data;
    var fullname = req.body.fullname;
    var filename = `${UserPath}${fullname}.json`
    console.log(`Filename: ${filename} data: ${data}`);

    helper.CreateJSON(filename, data);
    
    setTimeout(() => {
      res.json({
        msg: 'Success'
      })
    }, 1000)
  } catch (error) {
    res.json({
      msg: error
    });
  }
});
