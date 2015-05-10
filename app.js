var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schools = require('./routes/schools');

var app = express();

var dbName = 'schoolDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api', schools);

module.exports = app;
