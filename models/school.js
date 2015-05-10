var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var schoolSchema = new Schema({
  name: String,
  id: String,
  lat: String,
  lng: String,
  rating: String,
  grades: String,
  programs: String
});
 
module.exports = mongoose.model('School', schoolSchema);
