var http = require('http');
http.globalAgent.maxSockets = Infinity;
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routers = require('./routes/routers');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname + '/')));
app.use('/bower_components',  express.static( path.join(__dirname + '/bower_components')));
app.use('/components',  express.static( path.join(__dirname + '/components')));

var dbName = 'schoolDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/index.html', function(req, res) {
  res.sendFile('/index.html', { root: __dirname });
});

app.get('/main.js', function(req, res) {
  res.sendFile('/main.js', { root: __dirname });
});

app.use('/v1', routers);

module.exports = app;
