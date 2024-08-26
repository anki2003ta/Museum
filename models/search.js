const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const searchSchema = new Schema({
  title: {
    type:String,
    required: true
  },
});
module.exports = mongoose.model('Search',searchSchema);