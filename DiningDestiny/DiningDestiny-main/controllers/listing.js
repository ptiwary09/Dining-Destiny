require('dotenv').config(); // Load environment variables

const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index.ejs', { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
        model: 'User'
      }
    })
    .populate('owner');
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  res.render('listings/show.ejs', { listing });
};

module.exports.createListings = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();
 
  let url = req.file.path;
  let filename = req.file.filename;
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created! ");
  res.redirect("/listings");
};

module.exports.editListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  res.render('listings/edit.ejs', { listing });
};

module.exports.updateListings = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
  
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash('success', 'Listing edited successfully!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
};

// const Listing = require("../models/listing");

module.exports.search = async (req, res) => {
  const query = req.query.q.trim().replace(/\s+/g, " ");

  if (!query) {
    req.flash("error", "Search value empty !!!");
    return res.redirect("/listings");
  }

  try {
    const searchRegex = new RegExp(query, 'i');  // case-insensitive search
    const allListings = await Listing.find({
      $or: [
        { title: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { country: { $regex: searchRegex } },
        { price: { $lte: parseInt(query) } }
      ]
    });

    if (allListings.length > 0) {
      res.render("listings/searchResults.ejs", { allListings });
    } else {
      req.flash("error", "No listings found.");
      res.render("listings/searchResults.ejs", { allListings: [] });
    }
  } catch (error) {
    req.flash("error", "An error occurred during the search.");
    res.redirect("/listings");
  }
};

