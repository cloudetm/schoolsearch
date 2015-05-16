var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var rankSchema = new Schema({
  name: String,
  href: String,
  area: String,
  rank_2013_14: String,
  rank_5y: String,
  rating_2013_14: String,
  rating_5y: String
}, {
  collection: 'cal_elem_rank'
});
 
module.exports = mongoose.model('CalRank', rankSchema);
