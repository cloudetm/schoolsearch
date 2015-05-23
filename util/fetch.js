var hq = require('hyperquest');
var fs = require('fs');
var wait = require('event-stream').wait;

var srcFile = process.argv[2],
    dstFile = process.argv[3],
    jsonData = [], 
    jsonResult = [],
    gCount = 0,
    TIMER_MS = 1000;

function fetch_data() {
  if (gCount === jsonData.length) {
    console.log('Bang: '+gCount);
    fs.writeFileSync(dstFile, JSON.stringify(jsonResult, null, 2));
    return;
  }

  var req, buffer,
  url = "http://www.cbe.ab.ca/schools/find-a-school/_vti_bin/SchoolProfileManager.svc/GetLocalSchools",
  body = {
    lat: jsonData[gCount].lat,
    lng: jsonData[gCount].lng,
    programid: "1",
    grades: ""
  };

  body = JSON.stringify(body);

  console.log('send body: '+jsonData[gCount].pt);

  opts = {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  }; 

  console.time("timer_Fetch");

  req = hq.post(url, opts);
  req.end(body);
  req.pipe(wait(function(err, data) {
    if (err) {
      console.log('request to CBE error: '+err);
      console.timeEnd("timer_Fetch");
    } else {
      var t = {
        postcode: jsonData[gCount].pt,
        result: JSON.parse(data),
        seq: gCount
      };
      jsonResult.push(t);
      console.log('receive data:\n '+JSON.stringify(t));
      gCount++;
      console.timeEnd("timer_Fetch");
      setTimeout(fetch_data, TIMER_MS);
    }
  }));
}

fs.readFile(srcFile, "utf-8", function(err, data) {
  if (err) { 
    console.log('Read file error: '+err);
  } else {
    jsonData = JSON.parse(data.toString());
    console.log('Total postcodes: '+jsonData.length);
    setTimeout(fetch_data, TIMER_MS);
  }
});

