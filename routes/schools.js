var School = require('../models/school');
var express = require('express');
var router = express.Router();

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
      res.send({message:'School Added'});
    });
  });

module.exports=router;
