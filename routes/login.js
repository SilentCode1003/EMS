var express = require('express');
const session = require('express-session');
var router = express.Router();

var helper = require('./repository/customhelper')
var UserPath = `${__dirname}/data/accounts/`;



/* GET home page. */
router.get('/', function (req, res) {

    console.log(req.session);
    res.render('login', { title: 'Equipment Monitoring System' });
});

module.exports = router;

router.post('/authentication', (req, res) => {
    try {
        var id = req.body.id;
        var password = req.body.password;
        var files = helper.GetFiles(UserPath);
        var message = "";

        message = "error";
        files.forEach(file => {
          var filename = `${UserPath}${file}`;
          var data = helper.ReadJSONFile(filename);
          console.log(data);

          data.forEach((key, item) => {
            console.log(`user:${key.username} password:${key.password}`)
            if (key.username == id && key.password == password) {
              message = 'success';

              //store data to session
              req.session.isAuth = true;
              req.session.username = key.username;
              req.session.fullname = key.fullname;
              req.session.position = key.accounttype;
            }
          })
        })


        console.log(message);

        if (message == "success") {
            res.json({
                msg: message
            });
        }

        if (message == "error") {
            res.json({
                msg: 'error'
            });
        }


    } catch (error) {
        res, json({
            msg: error
        })
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {

            res.json({
                msg: err
            });

        }

        res.json({
            msg: "success"
        })
    });

});
