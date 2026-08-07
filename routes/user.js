const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware.js");

router.route("/signup")
.get((req, res) => { res.render("users/signup.ejs"); })
.post(wrapAsync(userController.signUpController));

router.route("/login")
.get((req, res) => { res.render("users/login.ejs"); })
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(userController.loginController)
);

router.get("/logout", userController.logoutController);

module.exports = router;