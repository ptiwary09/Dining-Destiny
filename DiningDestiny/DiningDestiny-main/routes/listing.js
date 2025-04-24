// listing.js routes

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing, isAuthor } = require('../middleware.js');
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// Index Route
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    upload.single('listing[image]'), 
    validateListing, 
    
    wrapAsync(listingController.createListings));

// New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show, Edit, Update, and Delete Routes
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListings))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));

// Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editListings));

// Search Route
router.get('/search', wrapAsync(listingController.searchListings));

module.exports = router;