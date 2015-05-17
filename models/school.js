var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var schoolSchema = new Schema({
  name: String,
  href: String,
  lat: String,
  lng: String,
  id: String,
  phone: String,
  postcode: String,
  addr: String,
  grades: Array 
}, {
  collection: 'cal_school_list'
});
 
module.exports = mongoose.model('CalSchool', schoolSchema);
