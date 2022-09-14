var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var x2js = require('x2js');
const { jsPDF } = require("jspdf");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountsRouter = require('./routes/accounts');
var equipmentRouter = require('./routes/equipment');
var reportRouter = require('./routes/reports');
var establishmentRouter = require('./routes/establishment');
var networksRouter = require('./routes/networks');
var EquipmentPulloutRouter = require('./routes/EquipmentPullout');
var NetworksPulloutRouter = require('./routes/NetworksPullout');
var m2cashequipmentRouter = require('./routes/m2cashequipment');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/equipment', equipmentRouter);
app.use('/reports', reportRouter);
app.use('/establishment', establishmentRouter);
app.use('/networks', networksRouter);
app.use('/EquipmentPullout', EquipmentPulloutRouter);
app.use('/NetworksPullout', NetworksPulloutRouter);
app.use('/m2cashequipment', m2cashequipmentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
