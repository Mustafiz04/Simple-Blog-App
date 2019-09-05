var mongoose = require("mongoose");

//Scheme setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    discription: String,
    comment : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
})

module.exports = mongoose.model("Campground", campgroundSchema);