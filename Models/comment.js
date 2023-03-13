const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    // UserId is for the user that made the comment
    userId:{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
    // Post that has the comment
    postId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"Post"},
    comment:{type:String, required:true}
   }

)
module.exports = mongoose.model("Comment",commentSchema)

