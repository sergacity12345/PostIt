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
                                url:`http://localhost:3500/postit/posts/${userId}?postId=${curr._id}&edit=${true}`
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
    console.log('here1')

    if(edit){
        User.find({_id:userId})
         .then(user=>{
            if(user.length >= 1){
                Post.find
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
