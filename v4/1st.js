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


 
app.get("/", (req, res) => {
    res.render("campground/homepage")
})


app.get("/campgrounds", (req, res) => {
    req.user
    Campground.find({}, function(err, allCamps){
        if(err){
            console.log(err)
        }else{
            res.render("campground/campgrounds", {camp : allCamps, currentUser : req.user});
        }
    })
})

app.get("/campgrounds/new", isLogedIn, (req, res) => {
    res.render("campground/new");
})

app.post("/campgrounds", (req, res) => { 
    // get data
    var name = req.body.name;
    var image = req.body.image;
    var dis = req.body.discription;
    var newCamp = {name : name, image: image, discription: dis};
    // camp.push(newCamp);
    // create new camp and add to database
    Campground.create(newCamp, function(err, newlyCamp){
        if(err){
            // console.log(err);
        }else{
            console.log(newlyCamp);
            // redirect
            res.redirect("/campgrounds");
        }
    })
    
    
});


//show more info about 
app.get("/campgrounds/:id", (req, res) =>{
    var i = req.params.id;
    Campground.findById(i).populate("comment").exec((err, foundCamp) => {
        if(err){
            console.log(err);
        }else{
            console.log(foundCamp)
            res.render("campground/show", {camp : foundCamp});
        }
    })
})



app.get("/campgrounds/:id/comments/new", isLogedIn, (req, res) =>{
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {foundCamp : foundCamp});
        }
    })
})

app.post("/campgrounds/:id/comments", isLogedIn , (req, res)=>{
    Campground.findById(req.params.id, function(err,  campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comment.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            })
        }
    })
})



// edit
app.get("/campgrounds/:id/edit", isLogedIn, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {foundCamp : foundCamp});
        }
    })
})

app.put("/campgrounds/:id", isLogedIn, (req, res) =>{
    req.body.camp.discription = req.sanitize(req.body.camp.discription);
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, updateCamp) => {
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


// delete
app.delete("/campgrounds/:id", isLogedIn, (req, res) =>{
    Campground.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})




// auth routes
app.get("/register", (req, res) =>{
    res.render("register");
})


app.post("/register", (req, res) =>{
    var newUser = new User({username : req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
});



app.get("/login",(req, res) =>{
    res.render("login");
})

app.post("/login", passport.authenticate("local",
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }) ,(req, res) =>{
})



app.get("/logout", (req, res) =>{
    req.logout();
    res.redirect("/campgrounds")
})

function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



var PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

