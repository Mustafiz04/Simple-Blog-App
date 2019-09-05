var express = require("express"),
    bodyparser = require("body-parser"),
    Campground = require("./model/camp"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    methodOveride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seeds");
    Comment = require("./model/comment"),
    User = require("./model/user");

    commentRoutes = require("./routes/comment"),
    CampgroundRoutes = require("./routes/campground"),
    authRoutes = require("./routes/auth"),
    destroyRoutes = require("./routes/destroy");

app = express();
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(methodOveride("_method"))
// seedDB();

// passport configuration
app.use(require("express-session")({
    secret : "Mustafiz is the best",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);
app.use("/campgrounds", CampgroundRoutes);
app.use(destroyRoutes);


// Campground.create(
//     {
//         name: "Mountain Goat's Rest", 
//         image: "https://www.photosforclass.com/download/flickr-1430198323",
//         discription: "This is a huge Mountain Goat,s Rest with best view"
//     },function(err, camp){
//         if(err){
//             console.log(err)
//         }else{
//             console.log(camp);
//         }
//     })

// var camp = [
//     {name: "Salmon Creek", image: "https://www.photosforclass.com/download/flickr-321487195"},
//     {name: "Granite Hill", image: "https://www.photosforclass.com/download/flickr-1430198323"},
//     {name: "Mountain Goat's Rest", image: "https://www.photosforclass.com/download/flickr-1430198323"},
//     {name: "Home", image: "https://www.photosforclass.com/download/flickr-2602356334"},
//     {name: "New York", image:"https://www.unsplash.com/photos/Jp-Ua5OiZKA"}
// ]




var PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

