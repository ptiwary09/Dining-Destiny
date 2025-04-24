const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js"); // Don't forget to import Listing model
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js")

const reviewController=require("../controllers/review.js");


// Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.dsetroyReview
));

module.exports = router;
