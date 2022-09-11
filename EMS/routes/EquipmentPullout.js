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
  res.render('EquipmentPullout', { title: 'Equipment Monitoring System' });
});

module.exports = router;

router.post('/save', function(req, res, next) {
  var status = 'Active';
  var targetDir = '/data/pullout/equipment/active/';
  var ticket = req.body.ticket;
  var store = req.body.fromstore;
  var itemname = req.body.itemname;
  var itemserial = req.body.itemserial;
  var pulloutdate = req.body.datepullout;
  var pulloutby = req.body.pulloutby;

  //Xml Details
  const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })
    .ele('EquipmentPulloutInfo')
      .ele('Ticket').txt(ticket).up()
      .ele('Store').txt(store).up()
      .ele('ItemName').txt(itemname).up()
      .ele('ItemSerial').txt(itemserial).up()
      .ele('PulloutDate').txt(pulloutdate).up()
      .ele('PulloutBy').txt(pulloutby).up()
      .ele('Status').txt(status).up()
    .up();
    const xml = root.end({ prettyPrint: true });
    console.log(xml);
    //Write and Save xml details into XML file
    let filename = store + '_' + itemname + '_' + itemserial +'.xml';
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

    res.json({
      msg:'success'
    });
    console.log('File saved!');
});