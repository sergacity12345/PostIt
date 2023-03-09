const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    userId:{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
    postDetails:{type:String, require:true}
   },
    { timestamps: true }

)
module.exports = mongoose.model("Post",postSchema)

