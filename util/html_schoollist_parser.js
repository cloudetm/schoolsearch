var $ = require('cheerio');
var fs = require('fs');

var htmlString = fs.readFileSync('calgary-school-list.html').toString();
var parsedHTML = $.load(htmlString);
var jsonData = [];
// var res = parsedHTML('tr').next(); // for the schoolist html, no need to skip the table header

parsedHTML('tr').map(function(i, elem) {
  row = $(elem).children();
  jsonData.push({
    "name": $(row).eq(1).text(),
    "href": $(row).eq(3).children('a').attr('href'),
    "lat": $(elem).attr('data-lat'),
    "lng": $(elem).attr('data-lng'),
    "id": $(elem).attr('data-id'),
    "grades": $(elem).attr('data-grades')
  });
});

pureJson = JSON.stringify(jsonData, null, 2);

console.log(pureJson);
//console.log(pureJson.length);


