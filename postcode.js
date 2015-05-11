var fs = require('fs');
var http = require('http');

var file = process.argv[2];

var headers = {
  'Content-Type': 'application/json'
};

var options = {
  host: '10.7.57.141',
  port: 8000,
  path: '/api/postcodes',
  method: 'POST',
  headers: headers
}

var req = http.request(options, function(res) {

});

function readFileToMongo(file) {
  fs.readFile(file, "utf-8", function(err, data) {
    var json = data
      .toString()
      .split('\n')
      .map(function(line) {
        var str = line.split(',').map(function(item) {
          return item.substr(1, item.length-2);
        });
        return {
          pt: str[0],
          lat: str[1],
          lng: str[2],
          area: str[3],
          region: str[4] 
        };
      });
    var pureJson = JSON.parse(JSON.stringify(json));

    //for (var i in pureJson) {
    //  console.log(pureJson[i]);
    //  req.write(pureJson[i]); 
    //};

    //pureJson.map(function(item) {
    //  console.log(item);
    //});
    for (var i = 0; i < pureJson.length; i++) {
      console.log(JSON.stringify(pureJson[i]));
      req.write(JSON.stringify(pureJson[i]));
    }

    req.end();
    //console.log(pureJson);
  });
}

readFileToMongo(file);
