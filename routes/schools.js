var School = require('../models/school');
var express = require('express');
var router = express.Router();

router.route('/schools').get(function(req, res) {
  School.find(function(err, schools) {
    if (err) {
      return res.send(err);
    }
    res.json(schools);
  });
});

module.exports=router;
