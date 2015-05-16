var http = require('http');
http.globalAgent.maxSockets = Infinity;
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routers = require('./routes/routers');

var app = express();

var dbName = 'schoolDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/index.html', function(req, res) {
  res.send('Hello theHosty API');
});
app.use('/v1', routers);

module.exports = app;
