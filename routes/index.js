const fs = require('fs');
var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
const { isAuth } = require('./controller/authBasic');

/* GET home page. */
router.get('/', isAuth, function (req, res, next) {
  res.render('index', { title: 'Equipment Monitoring System', fullname: req.session.fullname });
});


router.get('/getEquipment', function (req, res, next) {
  //list of paths
  var sevelelevenstores = __dirname + '/data/establishment/';
  var m2cashstores = __dirname + '/data/m2cash/stores/';
  var equipmentspare = __dirname + '/data/equipments/spare/';
  var equipmentpullout = __dirname + '/data/pullout/equipment/active/';
  var equipmentreturn = __dirname + '/data/pullout/equipment/return/';
  var equipmentdeploy = __dirname + '/data/equipments/deploy/';
  var networkspare = __dirname + '/data/network/spare/';
  var networkpullout = __dirname + '/data/pullout/network/active/';
  var networkreturn = __dirname + '/data/pullout/network/return/';
  var networkdeploy = __dirname + '/data/network/deploy/';

  var equipmentSpare;
  var equipmentReturn;
  var equipmentPullout;
  var equipmentDeploy;
  var networkSpare;
  var networkDeploy;
  var networkReturn;
  var networkPullout;
  var seveneleven = 0;
  var m2cash = 0;

  fs.readdir(sevelelevenstores, (err, files) => {
    if (err) throw err;
    seveneleven = files.length;
  });

  fs.readdir(m2cashstores, (err, files) => {
    m2cash = files.length;
  })

  fs.readdir(equipmentspare, (err, files) => {
    equipmentSpare = files.length;
  })

  fs.readdir(equipmentpullout, (err, files) => {
    equipmentPullout = files.length;
  })

  fs.readdir(equipmentreturn, (err, files) => {
    equipmentReturn = files.length;
  })

  fs.readdir(equipmentdeploy, (err, files) => {
    equipmentDeploy = files.length;
  })

  fs.readdir(networkspare, (err, files) => {
    networkSpare = files.length;
  })

  fs.readdir(networkpullout, (err, files) => {
    networkPullout = files.length;
  })

  fs.readdir(networkreturn, (err, files) => {
    networkReturn = files.length;
  })

  fs.readdir(networkdeploy, (err, files) => {
    networkDeploy = files.length;
  })


  setTimeout(() => {
    res.json({
      msg: 'Success',
      maxTicksLimit: 3,
      EquimentData: [equipmentSpare, equipmentDeploy, equipmentPullout, equipmentReturn],
      EquipmentLable: ['Spare', 'Deploy', 'Pullout', 'Return'],
      networkEquimentData: [networkSpare, networkDeploy, networkPullout, networkReturn],
      seveneleven: seveneleven,
      m2cash: m2cash
    })
  }, 1000);
  //equipments

});

module.exports = router;
