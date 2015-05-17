var $ = require('cheerio');
var fs = require('fs');

var htmlString = fs.readFileSync('rank-2015-elem.html').toString();
var parsedHTML = $.load(htmlString);
var jsonData = [];
var res = parsedHTML('tr').next(); // skip the table header

res.map(function(i, elem) {
  row = $(elem).children();
  jsonData.push({ 
    "name": $(row).eq(3).text(),
    "href": $(row).children('a').attr('href'),
    "area": $(row).eq(4).text(),
    "rank_2013_14": $(row).eq(0).text().split('/'),
    "rank_5y": $(row).eq(1).text().split('/'),
    "rating_2013_14": $(row).eq(5).text(),
    "rating_5y": $(row).eq(6).text()
  });
});

pureJson = JSON.stringify(jsonData, null, 2);

console.log(pureJson);
//console.log(pureJson.length);


/*
var row = [];
for (var count = 0; count < cells.length; count++) {
  row.push(cells[count].textContent.trim());        
  console.log(row);
};
*/
