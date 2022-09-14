const fs = require('fs');
var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();      



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('account', { title: 'Equipment Monitoring System'});
});

module.exports = router;

router.post('/save', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var fullname = req.body.fullname;
  var accounttype = req.body.accounttype;
  console.log(username + password + fullname + accounttype);

  //Xml Details
  const root = create({ version: '1.0', encoding: "UTF-8", standalone: "yes" })                        
    .ele('AccountInfo')                        
      .ele('Username').txt(username).up()
      .ele('Password').txt(password).up()                       
      .ele('Fullname').txt(fullname).up()
      .ele('AccountType').txt(accounttype).up()                                    
    .up();                    
    const xml = root.end({ prettyPrint: true });
    console.log(xml);

    //Write and Save xml details into XML file
    let filename = __dirname + '/data/accounts/'+ fullname +'.xml';
    fs.writeFileSync(filename, xml, function(err) {
    if (err) throw err;
      res.json({
        msg: 'error',
        data: err
      });
    });

    console.log(filename);
    console.log('File saved!');
   
    res.json({
      msg:'success'
    });
});
