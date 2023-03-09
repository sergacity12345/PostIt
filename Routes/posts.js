const express = require('express')

const router = express.Router()

const Post = require('../Models/post')

// const {validateSignup} = require('../validation/validate')

const bcrypt = require("bcrypt")

const User = require("../Models/user")


const mongoose = require('mongoose')
const e = require('express')


router.post('/user/:userId/posts', (req,res,next)=>{
    const userId = req.params.userId;
    User.find({_id:userId})
     .then(user=>{
        if(user.length >= 1){
            const post = new Post({
                userId:userId,
                postDetails:req.body.postit,
            })
            post.save()
             .then(resp=>{
                res.status(201).json({
                    message:"Posted successfully"
                })
             })
             .catch(err=>{
                res.status(500).json({
                    error:err
                })
             })
        }
     })
})

router.get('/posts/:userId',(req,res,next)=>{
    const postId = req.query.postId
    const userId = req.params.userId
    User.find({_id:userId})
     .then(user=>{
        if(user.length >= 1){
            Post.find({_id:postId})
             .select('userId postDetails')
             .then(post=>{
                if(post.length >= 1){
                    res.status(200).json({
                        singlePost:post.map(curr=>{
                            return{
                                userId:curr.userId,
                                content:curr.postDetails,
                                request:{
                                type:"PATCH",
                                url:`http://localhost:3500/postit/posts/${userId}?postId=${curr._id}&edit=${true}`,
                                
                            },
                            deleteRequest:{
                                type:"DELETE",
                                for:"Deleting individual post",
                                url:`http://localhost:3500/postit/posts/${userId}?postId=${postId}&delete=${true}`
                            }}
                        })
                    })
                }else{
                    res.status(404).json({
                        message:"Post not found"
                    })
                }
             })
             .catch(err=>{
                    res.status(500).json({
                        error:err
                    })
                }
             )
        }else{
            res.status(404).json({
                message:"User not found"
            })
        }
     })
     .catch(err=>{
        res.status(500).json({
            error:err
        })
     })    
})

router.patch('/posts/:userId',(req,res,next)=>{
    const postId = req.query.postId
    const edit = req.query.edit
    const userId = req.params.userId
    if(edit){
        User.find({_id:userId})
         .then(user=>{
            if(user.length >= 1){
               Post.updateOne({_id:postId},{ postDetails:req.body.postit})
                .then(update=>{
                    res.status(202).json({
                        message:"updated successfully",
                        request:{
                            type:"DELETE",
                            url:`http://localhost:3500/postit/posts/${userId}?postId=${postId}&delete=${true}`
                        }
                    })
                })
                .catch(err=>{
                    res.status(501).json({
                        error:err
                    })
                })
            }else{
                res.status(404).json({
                    message:"User not found"
                })
            }
         })
         .catch(err=>{
            res.status(500).json({
                error:err
            })
         })
    }
})

router.delete('/posts/:userId',(req,res,next)=>{
    const postId = req.query.postId
    const dele = req.query.delete
    const userId = req.params.userId
    if(dele){
        User.find({_id:userId})
         .then(user=>{
            if(user.length >= 1){
               Post.deleteOne({_id:postId})
                .then(doc=>{
                    if(doc.length >= 1){
                        res.status(200).json({
                            message:"Post Deleted",
                            request:{
                                type:"GET",
                                url:`http://localhost:3500/postit/user/${userId}`
                            }
                        })
                    }else{
                        res.status(404).json({
                            message:"No post found"
                        })
                    }
                })
            }else{
                res.status(404).json({
                    message:"User not found"
                })
            }
         })
         .catch(err=>{
            res.status(500).json({
                error:err
            })
         })
    }
})

module.exports = router
