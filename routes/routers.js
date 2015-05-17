var CalSchool = require('../models/school');
var CalRank = require('../models/rank');
var Postcode = require('../models/postcode');
var express = require('express');
var router = express.Router();
var hq = require('hyperquest');
var wait = require('event-stream').wait;
var async = require('async');

/*
router.route('/schools')
  .get(function(req, res) {
    School.find(function(err, schools) {
      if (err) {
        return res.send(err);
      }
      res.json(schools);
    });
  })
  .post(function(req,res){
    var school = new School(req.body);
    school.save(function(err){
      if(err)
        res.send(err);
      res.send({message:'School Added:'+school});
    });
  });


router.route('/postcodes')
  .get(function(req, res) {
    Postcode.find(function(err, postcodes) {
      if (err) {
        return res.send(err);
      }
      res.json(postcodes);
    });
  })
  .post(function(req,res){
    var postcode = new Postcode(req.body);
    postcode.save(function(err){
      if(err)
        res.send(err);
      res.send({message:'Postcode Added:'+postcode});
    });
  });
*/

function querySchoolBoardData(position)
{
  var req, buffer,
  url = "http://www.cbe.ab.ca/schools/find-a-school/_vti_bin/SchoolProfileManager.svc/GetLocalSchools",
  body = {
    lat: position.lat,
    lng: position.lng,
    programid: "1",
    grades: ""
  };
 
  body = JSON.stringify(body);
  console.log(body);

  opts = {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  }; 

  req = hq.post(url, opts);
  req.end(body);

  return req;
}

function handleError(err) {
  console.log('handleError: ' + err);
}

router.route('/postcodes/:code')  // code format is T1Y5K2
  .get(function(req, res) {
    Postcode.findOne(
      { pt: req.params.code.toUpperCase() }, 
      { _id: 0, lat: 1, lng: 1 },
      function(err, pos) {
        if (err) {
          return res.send(err);
        }
        if (pos === null) {
          return res.send('[]');
        }
        console.time("timer");
        var qry = querySchoolBoardData(pos);
        
        qry.pipe(
          wait(function(err, data) {
              /* comment out for testing today as CBE endpoint out of service.
              if (err) {
                res.send(err);
              }
              */
              // -TBD, store the hash like, { postcode: 'T1Y5K2', schools: '12, 34, 56, 78' }

              fakedata = '[191, 221, 66, 58]'; // fake data for test

              var qryResult = [], s = fakedata.toString();

              async.map(s.substr(1, s.length-2).split(','), function(id, callback) {
                CalSchool.findOne(
                  { id: id.trim() },
                  { _id: 0, id: 1, name: 1, lat: 1, lng: 1, grades: 1, postcode: 1, phone: 1, addr: 1 },
                  function(err, schoolDoc) {
                    if (err) return callback(err);
                    if (schoolDoc === null) {
                      return callback(err);
                    } 
                    console.log(schoolDoc);
                    var orig = schoolDoc.name;
                    var n = orig.indexOf("School");
                    var after = n > -1 ? orig.substr(0, n) : orig;
                    console.log(after.trim());
                    CalRank.findOne(
                      { name: after.trim() },
                      { _id: 0, name: 1, area: 1, rank_2013_14: 1, rank_5y: 1, rating_2013_14: 1, rating_5y: 1 },
                      function(err, rankDoc) {
                        if (err) {
                          console.log('no found school rank: '+after.trim()+':'+err);
                          return callback(err);
                        }

                        if (rankDoc === null) {
                          qryResult.push({
                            id: schoolDoc.id,
                            name: schoolDoc.name,
                            area: "Calgary", // -TBD, hack for the time being.
                            grades: schoolDoc.grades,
                            postcode: schoolDoc.postcode,
                            phone: schoolDoc.phone,
                            addr: schoolDoc.addr,
                            lat: schoolDoc.lat,
                            lng: schoolDoc.lng
                          });
                        } else {
                          qryResult.push({
                            id: schoolDoc.id,
                            name: schoolDoc.name,
                            area: rankDoc.area,
                            rank_2013_14: rankDoc.rank_2013_14,
                            rank_5y: rankDoc.rank_5y,
                            rating_2013_14: rankDoc.rating_2013_14,
                            rating_5y: rankDoc.rating_5y,
                            grades: schoolDoc.grades,
                            postcode: schoolDoc.postcode,
                            phone: schoolDoc.phone,
                            addr: schoolDoc.addr,
                            lat: schoolDoc.lat,
                            lng: schoolDoc.lng
                          });
                        }
                        callback();
                      }
                    );
                  } // end of function(err, schoolDoc)
                ); // end of CalSchool.findOne
              }, function(err) {
                console.log(qryResult);
                res.send(JSON.stringify(qryResult, null, 2));
              });
            }
        ));
        //
        console.timeEnd("timer");
      }
    );
  });

module.exports=router;
