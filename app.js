if(process.env.NODE_ENV != "production" ){
    require("dotenv").config({ quiet: true });
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log("DB URL:", process.env.ATLASDB_URL);

main().then(() => {
    console.log("connected to mongodb");
})
.catch((e) => {
    console.log(e);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// app.get("/", (req, res) => {
//     res.send("Hi, i am root!");
// });

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET
//     },
//     touchAfter: 24 * 60 * 60
// })

// store.on("error", () => {
//     console.log("ERROR IN MONGO STORE");
// })


// // console.log("SECRET =", process.env.SECRET);
const sessionOptions = {
   // store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

// const validat
// Listing = (req, res, next) => {
//     let {err} = listingSchema.validate(req.body);

//     if(err) {
//         let {errmsg} = err.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errmsg);
//     } else{
//         next();
//     }
// }

// const validateReview = (req, res, next) => {
//     let {err} = reviewSchema.validate(req.body);

//     if(err) {
//         let {errmsg} = err.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errmsg);
//     } else{
//         next();
//     }
// }

// // index route
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", {allListings});
// }));

// //new route
// app.get("/listings/new", (req, res) => {
//    res.render("listings/new.ejs");
// })

// //show route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", {listing});
// }));

// //create route
// app.post("/listings", validateListing,wrapAsync(async(req, res, next) => {
// // let {title, description, image, price, country, location} = req.body;
// // let listing = req.body.listing;
// // console.log(listing);
// // try{ 
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "Invalid listing data");
//     // }

//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error) {
//     //     throw new ExpressError(400, result.error);
//     // }

//     const newListing =  new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// // } catch(e) {next(e); }
// }
// ));


// //edit route
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id); 
//     res.render("listings/edit.ejs", {listing}); 
// }));

// //update route
// app.put("/listings/:id",validateListing, wrapAsync(async(req, res) => {
//   let {id} = req.params;
//   await Listing.findByIdAndUpdate(id, {...req.body.listing});
//   res.redirect(`/listings/${id}`);
// }));

// //delete route
// app.delete("/listings/:id", wrapAsync(async(req ,res) => {
//     let {id} = req.params;
//     let deletedList=  await Listing.findByIdAndDelete(id);
//     console.log(deletedList);
//     res.redirect("/listings");
// }));




                 //mdlw


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  //store
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    console.log("Middleware executed");
    console.log(res.locals);
    next();
});

// app.get("/demouser", async (req, res) =>  {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// // reviews  
// // post review route
// app.post("/listing/:id/reviews", validateReview, wrapAsync(async(req, res) => {

//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     // console.log("new review saved");
//     // res.send("Review Saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// //delete review route
// app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     // pull operator - "removes" from an existing array all instances of a value or values that matches a specified condition 
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }));



// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute Goa",
//         country: "INDIA"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


// app.all('*', (req, res) => {   // it is not valid in express - 5.0
//   res.status(404).send('Error 404: The requested resource was not found.');
// });

// app.all("{*splat}", (req, res, next) => { 
//    // res.status(404).send("Error 404: The requested resource was not found.");
//    next(new ExpressError(404, "Page not found!"));
// });


app.all("/*splat", (req, res, next) => { 
   next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
   // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});