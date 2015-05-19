var CalSchool = require('../models/school');
var CalRank = require('../models/rank');
var Postcode = require('../models/postcode');
var PostcodeSearchCache = require('../models/postcode_search_cache');
var express = require('express');
var router = express.Router();
var hq = require('hyperquest');
var wait = require('event-stream').wait;
var async = require('async');
var Q = require('q');

/* Hold off these routes for the time being

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

function querySchoolBoardData(position) {
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

function findSchoolInfoWithRank(schoolList, respHandle) {
  var qryResult = [], s = schoolList.toString();

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
    respHandle.send(JSON.stringify(qryResult, null, 2));
  });
}

router.route('/postcodes/:postcode')  // code format is T1Y5K2
  .get(function(req, res) {
    var schoolList = null, doCache = 0, postcode = req.params.postcode.toUpperCase();

    console.time("timerHandleGETPostcode");

    /***************************************************
     * 1. Using async (default)
     ***************************************************/
    /*
    async.series([
      function(callback) {
        PostcodeSearchCache.findOne(
          { postcode: postcode },
          { _id: 0 , postcode: 1, id: 1 },
          function(err, result) {
            if (err) callback(err);
            if (!result)  return callback();
            schoolList = result.id.slice();
            console.log('schoolList: ' + result.id);
            return callback();
          }
        );        
      },
      function(callback) {
        if (schoolList !== null) {
          console.log('Postcode cache hit: ' + postcode + ' : ' + schoolList);
          findSchoolInfoWithRank(schoolList, res);
          callback();
        } else {
          console.log('Postcode cache miss, search external source, postcode: ' + postcode);

          Postcode.findOne(
            { pt:  postcode }, 
            { _id: 0, lat: 1, lng: 1 },
            function(err, pos) {
              if (err) {
                callback(err);
                return res.send(err);
              }
              if (!pos) {
                callback('Post code no found!');
                return res.send('[]');
              }

              console.time("timerHandleFindSchoolData");
              querySchoolBoardData(pos).pipe(
                wait(function(err, data) {
                  if (err || !data) {
                    console.timeEnd("timerHandleFindSchoolData");
                    res.send(err);
                    callback(err);
                  }

                  findSchoolInfoWithRank(data, res);
                  schoolList = data.slice();
                  doCache = 1;
                  callback();
                }
              ));
              console.timeEnd("timerHandleFindSchoolData");
            }
          );
        }
        console.timeEnd("timerHandleGETPostcode");
      }
      ], function(err) {
        if (err) console.log(err);
        if (doCache === 1) {
          console.log('Caching schoolList: '+schoolList);
          var postcodeCache = new PostcodeSearchCache({ postcode: postcode, id: schoolList.toString() });
          postcodeCache.save(function(err) {
            if (err) {
              return console.log(err);
            }
            console.log('> Done for caching the postcode/schools pair');
          });
        }
    });

    */

    /***************************************************
     * 2. Using Q
     ***************************************************/
    function Q_FindPostcodeCache(postcode) {
      var deferred = Q.defer();

      PostcodeSearchCache.findOne(
        { postcode: postcode },
        { _id: 0 , postcode: 1, id: 1 },
        function(err, result) {
          if (err) deferred.reject(err);
          if (!result)  return deferred.reject(err);
          console.log('found in cache, schoolList: ' + result.id);
          deferred.resolve(result.id.slice());
        }
      );
      return deferred.promise;
    }

    function Q_FindSchoolInfo(school_id) {
      var deferred = Q.defer();

      CalSchool.findOne(
        { id: school_id.trim() },
        { _id: 0, id: 1, name: 1, lat: 1, lng: 1, grades: 1, postcode: 1, phone: 1, addr: 1 },
        function(err, schoolDoc) {
          if (err) deferred.reject(err);
          if (schoolDoc === null) {
            return deferred.reject(err);
          } 
          console.log(schoolDoc);
          deferred.resolve(schoolDoc);
        }
      );
      return deferred.promise;
    }

    function Q_FindSchoolRank(schoolDoc) {
      var deferred = Q.defer();
      var orig = schoolDoc.name;
      var n = orig.indexOf("School");
      var schName = n > -1 ? orig.substr(0, n) : orig;
      console.log('Find school rank: ' + schName.trim());

      CalRank.findOne(
        { name: schName.trim() },
        { _id: 0, name: 1, area: 1, rank_2013_14: 1, rank_5y: 1, rating_2013_14: 1, rating_5y: 1 },
        function(err, rankDoc) {
          if (err) {
            console.log('no found school rank: '+schName.trim()+' : '+err);
            return deferred.reject(err);
          }
          console.log(rankDoc);
          deferred.resolve({ 
            info: schoolDoc,
            rank: rankDoc
          });
        }
      );
      return deferred.promise;
    }

    function Q_FindSchoolList(schoolList) {
      var s = schoolList.toString();
      var promiseArray = [];

      s.substr(1, s.length-2).split(',').forEach(function(school_id) {
        var eachPromise = Q_FindSchoolInfo(school_id).then(Q_FindSchoolRank);
        promiseArray.push(eachPromise);
      });

      return Q.all(promiseArray);
    }

    Q_FindPostcodeCache(postcode).then(Q_FindSchoolList).then(function(values) {
        console.log(values);
      });
  });

module.exports=router;
