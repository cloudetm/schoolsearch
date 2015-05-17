var $ = require('cheerio');
var fs = require('fs');
var _ = require('lodash');

var htmlString = fs.readFileSync('calgary-school-list.html').toString();
var parsedHTML = $.load(htmlString);
var jsonData = [];
// var res = parsedHTML('tr').next(); // for the schoolist html, no need to skip the table header

parsedHTML('tr').map(function(i, elem) {
  var row = $(elem).children();
  jsonData.push({
    "name": $(row).eq(1).text(),
    "href": $(row).eq(3).children('a').attr('href'),
    "lat": $(elem).attr('data-lat'),
    "lng": $(elem).attr('data-lng'),
    "id": $(elem).attr('data-id'),
    "grades": $(elem).attr('data-grades').split(',').filter(function(el) { return el !== ""; })
  });
});

var pureJson = JSON.stringify(jsonData, null, 2);

//console.log(pureJson);

htmlString = fs.readFileSync('cal-school-directory.html').toString();
parsedHTML = $.load(htmlString);

var jsonDataMoreInfo = [];

parsedHTML('tr').next().map(function(i, elem) {
  var row = $(elem).children();
  jsonDataMoreInfo.push({
    "name": $(row).eq(0).text(),
    "addr": $(row).eq(1).text(),
    "phone": $(row).eq(2).text()
  });
});

pureJson = JSON.stringify(jsonDataMoreInfo, null, 2);

//console.log(pureJson);

var finalJson = [];

jsonData.forEach(function(elem) {
  var find = _.findWhere(jsonDataMoreInfo, {"name": elem.name});
  if (typeof find !== 'undefined') {
    elem.addr = find.addr;
    elem.phone = find.phone;
    var slen = find.addr.length;
    elem.postcode = find.addr.substr(slen-7, slen-1).trim().split(' ').join('');
    //console.log(elem);
    finalJson.push(elem); 
  } else {
    console.log("mismatched: "+elem.name);
  }
});

pureJson = JSON.stringify(finalJson, null, 2);
console.log(pureJson);


