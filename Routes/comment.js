const express = require('express')

const router = express.Router()

const Post = require('../Models/post')

const Comment = require('../Models/comment')

// const {validateSignup} = require('../validation/validate')

const bcrypt = require("bcrypt")

const User = require("../Models/user")


const mongoose = require('mongoose')

/** We find a post using the ID we got from the url to know if we have such post on our DB */
router.post('/comments/:postId',(req,res,next)=>{
    const postId = req.params.postId;
    const userId = req.query.userId
    Post.find({_id:postId})
     .then(post=>{
        if(post.length >= 1){
            const comments = new Comment({
                userId:userId,
                postId:postId,
                comment:req.body.comment
            })
            return comments.save()
        }
     })   
     .then(comment=>{
        res.status(201).json({
            message:"Commented successfully",
            commentInfo:{
                userId:comment.userId,
                postId:comment.postId,
                comment:comment.comment,
                commentId:comment._id
            }
        })
     }) 
     .catch(err=>{
        res.status(500).json({
            error:err
        })
     })
})

/** We get all comments of a particular USER that POST using the postID to know if we have such post with any comment */ 
router.get('/comments/:userId', (req,res,next)=>{
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
router.get('/comments/comment/:userId/',(req,res,next)=>{
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
})


router.delete('/comments/comment/:userId/',(req,res,next)=>{
    const userId = req.params.userId
    const commentId = req.query.commentId
    
})


module.exports = router
