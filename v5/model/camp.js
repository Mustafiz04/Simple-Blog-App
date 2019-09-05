var mongoose = require("mongoose");

//Scheme setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    discription: String,
    created : {type: Date, default: Date.now},
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    comment : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
})

module.exports = mongoose.model("Campground", campgroundSchema);