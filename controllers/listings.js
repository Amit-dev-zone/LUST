const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const { q } = req.query;
    let query = {};
    if (q && q.trim() !== "") {
        const searchRegex = new RegExp(q.trim(), "i");
        query = {
            $or: [
                { title: searchRegex },
                { location: searchRegex },
                { country: searchRegex },
                { description: searchRegex }
            ]
        };
    }
    const allListings = await Listing.find(query);
    if (q && allListings.length === 0) {
        req.flash("error", `No listings found for "${q}"`);
    }
    res.render("listings/index.ejs", { allListings, searchQuery: q || "" });
};

module.exports.newController = (req, res) => {
   res.render("listings/new.ejs");
};

module.exports.showController = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createController = async(req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};
    } else if (!newListing.image || !newListing.image.url) {
        newListing.image = {
            filename: "defaultlistingimage",
            url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60"
        };
    }
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.editController = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image ? listing.image.url : "";
    if (originalImageUrl && originalImageUrl.includes("/upload")) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateController = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteController = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};