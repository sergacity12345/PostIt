const express = require('express')

const router = express.Router()

const Post = require('../Models/post')

// const {validateSignup} = require('../validation/validate')

const bcrypt = require("bcrypt")

const User = require("../Models/user")


const mongoose = require('mongoose')


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

module.exports = router
