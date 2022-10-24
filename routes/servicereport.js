var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('servicereport', { 
    title: 'Equipment Monitoring System',
    provider: '5L SOLUTIONS SUPPLY & ALLIED SERVICES CORP.',
    company: 'M2CASH',
    ticket: 'N/A',
    storeaddress: 'Sanciangko Cor. Borromeo St, Cebu City, Cebu',
    storename: 'PURCHASER PARDO',
    date: '2022-04-30',
    personel: 'JOSEPH ORENCIO',
    storeperson: 'THESA JOY MARIA CURIE',
    position: 'MANAGER',
    storecontact: '09364423663',
    reportedconsern: 'INSTALLATION OF AIMAZING DEVICE',
    findings: 'PRINTER PORT MATCH TO ALLOCATED DEVICE',
    servicedone: 'INSTALL DEVICE BETWEEN POS PRINTER TO UNIT',
    atf: '100001',
    equipment: 'AIMAZING/SMART MODEM',
    oldserial: 'N/A',
    newserial: 'N/A',
    timein: '1230H',
    timeout: '1245H'
   });
});

module.exports = router;
