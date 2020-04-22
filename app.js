const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const url = require('url');

const iiif2Router = require('./routes/iiif2');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/iiif/2', iiif2Router);
app.use('/public', function(req, res, _next) {
  let baseUrl = process.env.IIIF_PUBLIC_BASE.replace(/\/+$/, '');
  res.set('Location', baseUrl + req.path).status(302).send();
})
app.use('/', function(_req, res, _next) {
  res.set('Location', '/iiif/2').status(302).send();
})

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
