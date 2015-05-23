var fs = require('fs');
//var http = require('http');
var hq = require('hyperquest');
var file = process.argv[2];

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
    console.log(JSON.stringify(tmpFile, null, 2));

    //var json = JSON.parse(JSON.stringify(tmpFile));

    /*
    var opts, ws, body, buffer,
    url = "http://127.0.0.1:8000/api/postcodes";
    
    for (var i = 0; i < 2000; i ++) {
      body = JSON.stringify(json[i]); 
      opts = {
      	headers: {
      	  'Content-Type': 'application/json',
      	  'Content-Length': body.length
      	}
      };       
      req = hq.post(url, opts);
      req.end(body);

      buffer = '';

      req.on('data', function(chunk) {
        return buffer += chunk;
      });

      req.on('error', function(err) {
        console.log(err);
      });

      req.on('response', function(res) {
        var err = null;     
        
        if (res.statusCode >= 400) {
          err = new Error('Bad statusCode in response: '+ res.statusCode);
          err.statusCode = res.statusCode;
        }
        
        res.body = buffer;
        console.log(res.body);        
      });
    };
    */

    /*
    json.forEach(function(item) {
      var opts, req, body, buffer,
      url = "http://127.0.0.1:8000/api/postcodes";

      body = JSON.stringify(item); 
      console.log(body);
      opts = {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length
        }
      };       
      req = hq.post(url, opts);
      req.end(body);

      buffer = '';

      req.on('data', function(chunk) {
        return buffer += chunk;
      });

      req.on('error', function(err) {
        console.log(err);
      });

      req.on('response', function(res) {
        var err = null;
      
        //console.log(ws.response);
        //res = ws.response;
        
        if (res.statusCode >= 400) {
          err = new Error('Bad statusCode in response: '+ res.statusCode);
          err.statusCode = res.statusCode;
        }
        
        res.body = buffer;
        console.log(res.body);        
      });
    
    });
    */
  });
}

readFileToMongo(file);

