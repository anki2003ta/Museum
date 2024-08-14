const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listings.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const router = express.Router();
router
  .route("/")
  .get(wrapAsync(listingController.index))//index route
  .post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

//New route
router.get("/new", isLoggedIn,listingController.renderNewForm);
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))//Show route
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))//Update Route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//Delete router
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;