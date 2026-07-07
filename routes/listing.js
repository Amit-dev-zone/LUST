const express = require("express");
const router = express.Router();
// const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get(wrapAsync(listingController.index)) // index route
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync( listingController.createController ) //create route
);

// let {title, description, image, price, country, location} = req.body;
// let listing = req.body.listing;
// console.log(listing);
// try{ 
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Invalid listing data");
    // }

    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error) {
    //     throw new ExpressError(400, result.error);
    // }


router.get("/new", isLoggedIn, listingController.newController) //new route

router
.route("/:id")
.get(wrapAsync(listingController.showController)) //show route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateController)) //update route
.delete(wrapAsync(listingController.deleteController)); //delete route


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editController));  //edit route


module.exports = router;