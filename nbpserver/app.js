var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const bodyParser = require('body-parser');

var ridesRouter = require('./routes/rides');
var usersRouter = require('./routes/users');

var playlistsRouter = require('./routes/playlists');
var mongousersRouter = require('./routes/mongousers');

var app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "4mb" }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/rides', playlistsRouter);
app.use('/users', usersRouter);

app.use('/playlists', ridesRouter);
app.use('/mongousers', mongousersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404: Not Found');
  err.status = 404;
  next(err);
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render("error");
  if (err) {
    next(err);
  }
});

module.exports = app;
