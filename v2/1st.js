var express = require("express");
app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Scheme setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    discription: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

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
    res.render("homepage")
})


app.get("/campgrounds", (req, res) => {
    Campground.find({}, function(err, allCamps){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds", {camp : allCamps});
        }
    })
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
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
    Campground.findById(i, (err, foundCamp) => {
        if(err){
            console.log(err);
        }else{
            res.render("show", {camp : foundCamp});
        }
    })
})




var PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running..."));

