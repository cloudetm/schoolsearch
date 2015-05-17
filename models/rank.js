var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var rankSchema = new Schema({
  name: String,
  href: String,
  area: String,
  rank_2013_14: Array,
  rank_5y: Array,
  rating_2013_14: Number,
  rating_5y: Number 
}, {
  collection: 'cal_elem_rank'
});
 
module.exports = mongoose.model('CalRank', rankSchema);
