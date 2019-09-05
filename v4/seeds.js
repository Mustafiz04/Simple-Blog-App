var mongoose = require("mongoose");
var Camground = require("./model/camp");
var Comment = require("./model/comment");


var data = [
    {
        name : "Big Ben",
        image : "https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?cs=srgb&dl=arc-de-triomphe-arch-architecture-705764.jpg&fm=jpg",
        discription : "Big Ben is situated in London."
    },
    {
        name : "Eiffel Tower",
        image : "https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?cs=srgb&dl=arc-de-triomphe-arch-architecture-705764.jpg&fm=jpg",
        discription : "Big Ben is situated in London."
    },
    {
        name : "London Bridge",
        image : "https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?cs=srgb&dl=arc-de-triomphe-arch-architecture-705764.jpg&fm=jpg",
        discription : "Big Ben is situated in London."
    }
]





function seedDB(){
    Camground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Campground....");
        data.forEach(function(camp){
            Camground.create(camp, function(err, campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("camp added");
                    Comment.create({text: "London is best place to visit.", author: "aaka"}, function(err, comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comment.push(comment);
                            campground.save();
                            console.log("comment added");
                        }
                    })
                }
            })
        })
    });
}

module.exports = seedDB;
