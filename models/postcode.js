var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var postcodeSchema = new Schema({
  pt: String,
  lat: String,
  lng: String,
  area: String,
  region: String
});

module.exports = mongoose.model('Postcode', postcodeSchema);
