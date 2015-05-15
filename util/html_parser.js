var $ = require('cheerio');
var fs = require('fs');

var htmlString = fs.readFileSync('rank-2015-elem.html').toString();
var parsedHTML = $.load(htmlString);
var jsonData = [];
var res = parsedHTML('tr').next(); // skip the table header

res.map(function(i, elem) {
  row = $(elem).children();
  jsonData.push({ 
    "2013-14-Rank": $(row).eq(0).text(),
    "Rank-in-last-5Y": $(row).eq(1).text(),
    "SchoolName": $(row).eq(3).text(),
    "SchoolHref": $(row).children('a').attr('href'),
    "Area": $(row).eq(4).text(),
    "2013-14-Rating": $(row).eq(5).text(),
    "Rating-in-last-5Y": $(row).eq(6).text()
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