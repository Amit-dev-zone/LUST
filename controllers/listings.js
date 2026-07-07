const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.newController = (req, res) => {
   res.render("listings/new.ejs");
}

module.exports.showController = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}

module.exports.createController = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, ".." , filename);
    const newListing =  new Listing(req.body.listing);
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
// } catch(e) {next(e); }
}

module.exports.editController = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", ("/upload/w_250"));
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateController = async(req, res) => {
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url, filename};
  await listing.save();
  }
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteController = async(req ,res) => {
    let {id} = req.params;
    let deletedList=  await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    console.log(deletedList);
    res.redirect("/listings");
}