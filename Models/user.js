const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{ type:String, require:true},
    name:{type:String, require:true},
    phonenumber:{type:Number, require:true},
    password:{type:Number, require:true},
    
})

module.exports = mongoose.model("User",userSchema)