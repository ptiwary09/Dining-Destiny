const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async (req, res) => {
    const { id } = req.params; // Correctly access the id from req.params
    // console.log(id);
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review({
      ...req.body.review,
      author: req.user._id, // Set the author to the logged-in user
    });
    // console.log(newReview)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Review added successfully!');

    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.dsetroyReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
  };