const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title:{
    type: String, 
    required: true,
  },
  description: String,
  image:{
    type: Object,
    properties: {
      filename: String,
      url: String,
    }
  },
  price: Number,
  location: String,
  country: String,
  pdf:{
    type:Object,
    properties: {
      filename: String,
      url: String,
      contentType: String,
      fileSize: Number
    }
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;