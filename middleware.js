const express = require("express");
const Review = require("./models/review.js");
const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// module.exports.isOwner = async (req, res, next) => {
//     let {id} = req.params;
//     let listings = await Listing.findById(id);
//     if(!listings.owner.equals(res.locals.currUser._id)) {
//         req.flash("error", "you are not the owner of this listing");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// }

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    // if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "you are not the owner of this listing");
    //     return res.redirect(`/listings/${id}`);
    // }
    next();
}


module.exports.validateListing = (req, res, next) => {
    let {err} = listingSchema.validate(req.body);
    if(err) {
        let {errmsg} = err.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else{
        next();
    }
}