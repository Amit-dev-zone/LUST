const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createController)
);

router.get("/new", isLoggedIn, listingController.newController);

router
.route("/:id")
.get(wrapAsync(listingController.showController))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateController))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteController));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editController));

module.exports = router;