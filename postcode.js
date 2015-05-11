var fs = require('fs');
var http = require('http');

var file = process.argv[2];

var headers = {
  'Content-Type': 'application/json'
};

var options = {
  host: 'localhost',
  port: 8000,
  path: '/api/postcodes',
  method: 'POST',
  headers: headers
}

var req = http.request(options, function(res) {

});

function readFileToMongo(file) {
  fs.readFile(file, "utf-8", function(err, data) {
    var tmpFile = data
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
    var json = JSON.parse(JSON.stringify(tmpFile));

    json.forEach(function(item) {
      var req = http.request(options, function(res) {});
      req.write(JSON.stringify(item)); 
      req.end();
      console.log(JSON.stringify(item));
    });

    //for (var i in pureJson) {
    //  console.log(pureJson[i]);
    //  req.write(pureJson[i]); 
    //};

    //pureJson.map(function(item) {
    //  console.log(item);
    //});
    //for (var i = 0; i < json.length; i++) {
    //  console.log(JSON.stringify(json[i]));
      //req.write(JSON.stringify(json[i]));
    //}

    //req.end();
    //console.log(pureJson);
  });
}

readFileToMongo(file);

