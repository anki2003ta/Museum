const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const router = express.Router({mergeParams : true});
const reviewController = require("../controllers/reviews.js");


//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;