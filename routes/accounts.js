const fs = require('fs');
var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
const helper = require('./repository/customhelper');
const UserPath = `${__dirname}/data/accounts/`



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('account', { title: 'Equipment Monitoring System', fullname: req.session.fullname });
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

router.get('/LoadData', (req, res, next) => {
  try {
    var dataArr = [];
    var files = helper.GetFiles(UserPath);

    files.forEach(file => {

      var filename = `${UserPath}${file}`;
      var data = helper.ReadJSONFile(filename);

      data.forEach((key, item) => {
        dataArr.push({
          Username: key.username,
          Password: key.password,
          Fullname: key.fullname,
          AccountType: key.accounttype
        });
      })
    });

    console.log(dataArr);

    res.json({
      msg: 'success',
      data: dataArr
    });


  } catch (error) {
    res.json({
      msg: error
    });
  }

});
