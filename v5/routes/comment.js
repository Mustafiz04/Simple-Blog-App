var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../model/camp");
var Comment = require("../model/comment");




router.get("/new", isLogedIn, (req, res) =>{
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {foundCamp : foundCamp});
        }
    })
})

router.post("/", isLogedIn , (req, res)=>{
    Campground.findById(req.params.id, function(err,  campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comment.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            })
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