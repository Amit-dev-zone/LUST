if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ quiet: true });
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wonderlust";
const LOCAL_DB = "mongodb://127.0.0.1:27017/wonderlust";
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);

async function main() {
    if (process.env.NODE_ENV === "production" && !process.env.ATLASDB_URL) {
        console.error("FATAL ERROR: ATLASDB_URL environment variable is not set in Render!");
        process.exit(1);
    }

    try {
        await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to MongoDB Database");
    } catch (e) {
        if (process.env.NODE_ENV !== "production") {
            console.log("Atlas connection failed, falling back to local MongoDB:", e.message);
            await mongoose.connect(LOCAL_DB);
            console.log("Connected to local MongoDB");
        } else {
            console.error("MongoDB Atlas connection failed in production:", e.message);
            throw e;
        }
    }
}

main().then(() => {
    startServer();
}).catch((e) => {
    console.error("MongoDB connection error:", e.message);
    process.exit(1);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

function startServer() {
    const store = MongoStore.create({
        client: mongoose.connection.getClient(),
        crypto: {
            secret: process.env.SECRET || "thisshouldbeabettersecret"
        },
        touchAfter: 24 * 60 * 60
    });

    store.on("error", (err) => {
        console.log("ERROR IN MONGO STORE", err);
    });

    const sessionOptions = {
        store,
        secret: process.env.SECRET || "thisshouldbeabettersecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    };

    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    });

    app.get("/", (req, res) => {
        res.redirect("/listings");
    });

    app.get("/privacy", (req, res) => {
        res.render("privacy.ejs");
    });

    app.get("/terms", (req, res) => {
        res.render("terms.ejs");
    });

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);


    app.use((req, res, next) => {
        next(new ExpressError(404, "Page not found!"));
    });

    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Something went wrong" } = err;
        res.status(statusCode).render("error.ejs", { err });
    });

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

