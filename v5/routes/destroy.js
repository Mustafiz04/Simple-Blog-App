var express = require("express");
var routes = express.Router({mergeParams : true});
var Campground = require("../model/camp");





// edit
routes.get("/campgrounds/:id/edit", checkCampgroundOwnership, (req, res) => {
    // is User logged in?
    Campground.findById(req.params.id, function(err, foundCamp){
        res.render("campground/edit", {foundCamp:foundCamp});
    })
})

routes.put("/campgrounds/:id", checkCampgroundOwnership, (req, res) =>{
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
routes.delete("/campgrounds/:id", checkCampgroundOwnership, (req, res) =>{
    Campground.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})


function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp){
            if(err){
                console.log(err);
            }else{
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

module.exports = routes;