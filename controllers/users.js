const User = require("../models/user.js");

module.exports.signUpController = async(req, res, next) => {
   try{
   let { username, email, password } = req.body;
   const newUser = new User({ username, email });
   const registeredUser = await User.register(newUser, password);

   req.login(registeredUser, (err) => { if (err) { return next(err); }
   
   req.flash("success", "Welcome to Wanderlust");
   res.redirect("/listings");
   })
   }
    catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginController = async(req, res) => {
    // Login logic here
    
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect("/listings");
}

module.exports.logoutController = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}