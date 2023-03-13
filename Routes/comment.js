const express = require('express')

const router = express.Router()

const Post = require('../Models/post')

const Comment = require('../Models/comment')

// const {validateSignup} = require('../validation/validate')

const bcrypt = require("bcrypt")

const User = require("../Models/user")

const auth = require("../Authenticate/authenticate")

const mongoose = require('mongoose')

/** We find a post using the ID we got from the url to know if we have such post on our DB */
router.post('/comments/:postId',auth,(req,res,next)=>{
    const postId = req.params.postId;
    const userId = req.query.userId
    User.find({_id:userId})
     .then(user=>{
        if(user.length < 1){
            res.status(404).json({
                message:"User not found"
            })
        }
        Post.find({_id:postId})
         .then(post => {
            if(post.length <1 ){
                res.status(404).json({
                    message:"Post not found"
                })  
            }
            const comments = new Comment({
                userId:userId,
                postId:postId,
                comment:req.body.comment
            })
            return comments.save()
         })
         .then(comment=>{
            res.status(201).json({
                message:"commented succesfully",
                comment
            })
         })
     })
     .catch(err=>{
            res.status(500).json({
                error:err
            })
         })

})

/** We get all comments of a particular USER that POST using the postID to know if we have such post with any comment */ 
router.get('/comments/:userId', auth,(req,res,next)=>{
    const userId = req.params.userId;
    const postId = req.query.postId
    User.find({_id:userId})
     .then(user=>{
        if(user.length >= 1){
            Comment.find({userId:userId,postId:postId})
             .then(comments=>{
                if(comments.length >= 1){
                    res.status(200).json({
                        message:"All comment",
                        numberOfComment:comments.length,
                        commentInfo:comments.map(curr=>{
                            return{
                                content:curr.comment,
                                commenter:curr.userId
                            }
                        })
                    })
                }else{
                    res.status(404).json({
                        message:'Not comment'
                    })
                }
             })
             .catch(err=>{
                res.status(500).json({
                    error:err
                })
             })
        }else{
            res.status(404).json({
                message:'Not found'
            })
        }
     })
     .catch(err=>{
        res.status(500).json({
            error:err
        })
     })
})

/** Here we get individual comment using their ID to check if any comment with such ID is found on our DB and also check for the user with UserID*/
router.get('/comments/comment/:userId/',auth,(req,res,next)=>{
    const commentId = req.query.commentId
    const userId = req.params.userId
    
    User.find({_id:userId})
     .then(user=>{
        if(user.length < 1){
            res.status(404).json({
                message:'Not found'
            })
        }
        Comment.find({_id:commentId})
         .select('_id userId postId comment')
         .then(result =>{
            res.status(200).json({
                result
            })
         })
         .catch(err=>{
            res.status(404).json({
                message:"No comment found"
            })
         })
     })
     .catch(err=>{
        res.status(500).json({
            error:err
        })
     })
})
/** We EDIT our comment here. Only a user that has commented can be able to access this API since we will look out for the users ID in the comment collections.*/ 
router.patch('/comments/comment/:userId/edit',auth,(req,res,next)=>{
    const userId = req.params.userId
    const commentId = req.query.commentId;
    const edit = req.query.edit
    if(edit){
        Comment.find({_id:commentId,userId:userId})
         .then(result=>{
            if(result.length < 1){
                return res.status(404).json({
                    message:"No comment found to edit"
                })
            }
            Comment.updateOne({_id:commentId},{ comment:req.body.comment})
             .then(successful=>{
                if(successful.length < 1){
                    res.status(404).json({
                        message:"Cant edit comment"
                    })
                    
                }else{
                    res.status(202).json({
                        message:"Updated successfully"
                    })
                }
             })
             .catch(err=>{
                res.status(500).json({
                    error:err
                })
             })
         })
         .catch(err=>{
            res.status(500).json({
                error:err
            })
         })
    }
})


/** We DELETE our comment here. Only a user that has commented can be able to access this API since we will look out for the users ID in the comment collections.*/ 
router.delete('/comments/comment/:userId/',auth,(req,res,next)=>{
    const userId = req.params.userId
    const commentId = req.query.commentId
    Comment.deleteOne({userId:userId, _id:commentId})
     .then(comments=>{
        if(comments.length <= 1){
            return res.status(404).json({
                message:"Cant delete comment"
            })
        }
        res.status(200).json({
            message:"Comment deleted successfully"
        })
     })
     .catch(err=>{
        res.status(500).json({
            error:err
        })
     })
})


module.exports = router
