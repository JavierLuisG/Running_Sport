var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// router of users
var usersRouter = require('./routes/users');

var app = express();

// general path
var api = "/api";
var version = "/v1";
// path of users
var usersPath = "/users";

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// for home
app.use('/', indexRouter);
// for users
app.use((api + version + usersPath), usersRouter);

module.exports = app;
