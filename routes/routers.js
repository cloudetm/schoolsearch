var School = require('../models/school');
var Postcode = require('../models/postcode');
var express = require('express');
var router = express.Router();
var hq = require('hyperquest');
var wait = require('event-stream').wait;

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
  req.on('error', function(err) {
    console.log(err);
  });

  return req;
}

router.route('/postcodes/:code')  // code format is T1Y5K2
  .get(function(req, res) {
    var self = this;
    Postcode.findOne(
      { pt: req.params.code }, 
      { _id: 0, lat: 1, lng: 1 },
      function(err, pos) {
        if (err) {
          return res.send(err);
        }
        var externalQry = querySchoolBoardData(pos);
        externalQry.pipe(
          wait(function(err, data) {
              if (err) {
                res.send(err);
              }
              res.send(data);
            }
        ));
      }
    );
  });

module.exports=router;