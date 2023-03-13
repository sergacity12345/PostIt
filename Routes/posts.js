const express = require('express')

const router = express.Router()

const Post = require('../Models/post')

// const {validateSignup} = require('../validation/validate')

const bcrypt = require("bcrypt")

const User = require("../Models/user")


const mongoose = require('mongoose')

const auth = require('../Authenticate/authenticate')

/** While working with this API ROUTES, we use the USER ID gotten from the URL as PARAMS. If USER is found we proceed by POSTING the information we want to store at the POST DB. As we post, the USER ID is also stored on the POST DB  to signify the user that made that particular post. When successful, a message is displayed.*/
router.post('/users/:userId/posts',auth, (req,res,next)=>{
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
                    message:"Posted successfully",
                    Details:resp
                })
             })
             .catch(err=>{
                res.status(500).json({
                    error:err
                })
             })
        }else{
            res.status(404).json({
                message:"Not found"
            })
        }
     })
})
/** Getting a single post using the post ID*/
router.get('/posts/:userId',auth,(req,res,next)=>{
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

/** While working with this API ROUTES , we check if the  QUERY is EDIT. If it is, we can continue working with it by finding a USER with the ID gotten from the URL. If USER is found we proceed by UPDATING  that POST(from the information passed theough the body) using the ID gotten from the URL. If successful a message, we will get a message.*/
router.patch('/posts/:userId',auth,(req,res,next)=>{
    const postId = req.query.postId
    const edit = req.query.edit
    const userId = req.params.userId
    if(edit){
        User.find({_id:userId})
         .then(user=>{
            if(user.length >= 1){
               Post.updateOne({userId:userId},{ postDetails:req.body.postit})
                .then(update=>{
                    if(update.length < 1){
                        res.status(500).json({
                            message:"User not found"
                        })
                    }
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

/** While working with this API ROUTES , we check if the  QUERY is DELETE. If it is, we can continue working with it by finding a USER with the ID gotten from the URL. If USER is found we proceed by DELETING  a POST using the ID gotten from the URL. If successful a message, we will get a message.*/ 
router.delete('/posts/:userId',auth,(req,res,next)=>{
    const postId = req.query.postId
    const dele = req.query.delete
    const userId = req.params.userId
    if(dele){
        User.find({_id:userId})
         .then(user=>{
            if(user.length >= 1){
               Post.deleteOne({_id:postId})
                .then(doc=>{
                    if(doc.length < 1){
                        res.status(404).json({
                            message:"No post found"
                        })
                        
                    }
                    res.status(200).json({
                        message:"Post Deleted",
                        request:{
                            type:"GET",
                            url:`http://localhost:3500/postit/user/${userId}`
                        }
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

module.exports = router
