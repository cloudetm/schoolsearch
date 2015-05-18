var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var postcodeSearchCacheSchema = new Schema({
  postcode: String,
  id: Array
});
 
module.exports = mongoose.model('PostcodeSearchCache', postcodeSearchCacheSchema);