const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
const { error } = reviewSchema.validate(req.body);
if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
}
next();
    }

const reviewController = require("../controllers/reviews.js");

// reviews  
// post review route
router.post("/", validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId", wrapAsync(reviewController.destroyReview));


module.exports = router;
