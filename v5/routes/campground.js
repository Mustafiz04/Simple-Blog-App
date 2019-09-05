var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../model/camp");





router.get("/", (req, res) => {
    req.user
    Campground.find({}, function(err, allCamps){
        if(err){
            console.log(err)
        }else{
            res.render("campground/campgrounds", {camp : allCamps, currentUser : req.user});
        }
    })
})

router.get("/new", isLogedIn, (req, res) => {
    res.render("campground/new");
})

router.post("/", isLogedIn, (req, res) => { 
    // get data
    var name = req.body.name;
    var image = req.body.image;
    var dis = req.body.discription;
    var author = {
        id : req.user.id,
        username : req.user.username
    }
    var newCamp = {name : name, image: image, discription: dis, author: author};
    // camp.push(newCamp);
    // create new camp and add to database
    Campground.create(newCamp, function(err, newlyCamp){
        if(err){
            // console.log(err);
        }else{
            // console.log(newlyCamp);
            // redirect
            res.redirect("/campgrounds");
        }
    })
});


//show more info about 
router.get("/:id", (req, res) =>{
    var i = req.params.id;
    Campground.findById(i).populate("comment").exec((err, foundCamp) => {
        if(err){
            console.log(err);
        }else{
            // console.log(foundCamp)
            res.render("campground/show", {camp : foundCamp});
        }
    })
})


function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}





module.exports = router;