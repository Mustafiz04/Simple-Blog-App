var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/practice", { useNewUrlParser: true });


var catSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number
});


var Cat = mongoose.model("Cat", catSchema);


//adding a new

// var english = new Cat({
//     first_name: "Mohammad",
//     last_name: "Ali",
//     age: 63
// })

// english.save(function(err, data){
//     if(err){
//         console.log("Somthing Went Wrong");
//     }else{
//         console.log("We just add Data");
//         console.log(data);
//     }
// })


Cat.create({
    first_name: "Hassan",
    last_name: "Ali",
    age: 25
}, function(err,data){
    if(err){
        console.log(err)
    }else{
        console.log(data);
    }
})

//retrieve all eng
Cat.find({}, function(err, men){
    if(err){
        console.log("OH No");
        console.log(err)
    }else{
        console.log("All Men Are ");
        console.log(men);
    }
})