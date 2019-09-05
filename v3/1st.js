var express = require("express"),
    bodyparser = require("body-parser"),
    Campground = require("./model/camp"),
    mongoose = require("mongoose");
    seedDB = require("./seeds");
    Comment = require("./model/comment");

app = express();
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
// seedDB();



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
    Campground.find({}, function(err, allCamps){
        if(err){
            console.log(err)
        }else{
            res.render("campground/campgrounds", {camp : allCamps});
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
    Campground.findById(i).populate("comment").exec((err, foundCamp) => {
        if(err){
            console.log(err);
        }else{
            console.log(foundCamp)
            res.render("campground/show", {camp : foundCamp});
        }
    })
})



app.get("/campgrounds/:id/comments/new", (req, res) =>{
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {foundCamp : foundCamp});
        }
    })
})

app.post("/campgrounds/:id/comments", (req, res)=>{
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




var PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

