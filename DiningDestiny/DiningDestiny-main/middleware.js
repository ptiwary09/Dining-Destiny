const Listing=require("./models/listing")
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      // Store the original URL to redirect back to after login
      req.session.returnTo = req.originalUrl;
      req.flash("error", "You must be logged in");
      return res.redirect("/login");
  }
  next(); // Continue to next middleware or route handler
};

// Middleware to save redirect URL
const saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.redirectUrl = req.session.returnTo;
      delete req.session.returnTo; // Clear the session value once it's used
  } else {
      res.locals.redirectUrl = '/listings'; // Default redirect URL
  }
  next();
};

const isOwner=async(req,res,next)=>{
  const { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash('error', 'You are not the owner of this listing.');
      return res.redirect(`/listings/${id}`)
    }
    next();
};

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const isAuthor=async(req,res,next)=>{
  let {id,reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash('error', 'You did not create this review.');
      return res.redirect(`/listings/${id}`)
    }
    next();
};

module.exports = { isLoggedIn, saveRedirectUrl,isOwner,validateListing,validateReview,isAuthor};
