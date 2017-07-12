var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var swaggerUi = require('swagger-ui-express'); // line 7 
var swaggerJSDoc = require('swagger-jsdoc'); // line 8 
 
// ... 
var options = { // line 27 
  swaggerDefinition: {
    info: {
      title: 'FooApp JSDOC', // Title (required) 
      version: '1.0.0', // Version (required) 
    },
  },
  apis: ['./routes/*'], // Path to the API docs 
};
var swaggerSpec = swaggerJSDoc(options); // line 36 
 
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', function(req, res) { // line 41 
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


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
