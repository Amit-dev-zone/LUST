const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookies", (req, res) => {
    res.cookie("made-in", "India", {signed: true}); 
    res.send("signed cookie sent");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("verified");
});

app.get("/getcookies", (req, res) => {
    res.send("sent you some cookies");
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
});

app.get("/", (req, res) =>{
    res.send("Welcome to the homepage");
});


app.use("/users", users);
app.use("/posts", posts);


app.listen(3000, (req, res) => {
    console.log("server is running on port 3000");
});

