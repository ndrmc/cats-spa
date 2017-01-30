var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash');
var flashToLocals = require('./middlewares/flash-to-locals-setter');
var equalsHelper = require('handlebars-helper-equal'); 
var moment = require('moment');

/* Routes */
var index = require('./routes/index');
var users = require('./routes/users');
var receipt = require('./routes/receipt.js');
var operation = require('./routes/operation.js');

var app = express();

var DateFormats = {
       short: "DD MMMM,  YYYY",
       long: "dddd DD MMMM, YYYY HH:mm"
};

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  helpers: { 
    equal: equalsHelper, 
    stringify: function(context ) { 
      return JSON.stringify(context); 
    }, 
    formatDate:  function (date, format) {
      if (moment) {
          // can use other formats like 'lll' too
          format = DateFormats[format] || format;
          return moment(date).format(format);
      } else {
          return date;
      }
    }, 
    isPresent: function (val, array) {
        return array.indexOf(val) !== -1; 
    },
    get: function(map,key){
    return map[key];
    }
  }
}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('s3cr3t')); //TODO: change/configure me 
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.use('/receipts', receipt);
app.use('/operations', operation);

app.use( flashToLocals);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
