var express = require("express");
var app = express();
var bodyparser = require("body-parser");
// var request = require("request");


app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


var camp = [
    {name: "Salmon Creek", image: "https://www.photosforclass.com/download/flickr-321487195"},
    {name: "Granite Hill", image: "https://www.photosforclass.com/download/flickr-1430198323"},
    {name: "Mountain Goat's Rest", image: "https://www.photosforclass.com/download/flickr-1430198323"},
    {name: "Home", image: "https://www.photosforclass.com/download/flickr-2602356334"},
    {name: "New York", image:"https://www.unsplash.com/photos/Jp-Ua5OiZKA"}
]

app.get("/", (req, res) => {
    // res.send("HOMEPAGE");
    res.render("homepage")
})


app.get("/campgrounds", (req, res) => {
    

    res.render("campground", {camp : camp});
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
})

app.post("/campgrounds", (req, res) => { 
    // get data
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = {name : name, image: image};
    camp.push(newCamp);
    // redirect
    res.redirect("/campgrounds");
});





var PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running..."));

