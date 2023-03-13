const express = require('express')

const router = express.Router()

const Post = require('../Models/post')

const {validateSignup} = require('../validation/validate')

const bcrypt = require("bcrypt")

const User = require("../Models/user")

const jwt = require("jsonwebtoken")

const mongoose = require('mongoose')

const auth = require('../Authenticate/authenticate')

/** Creating user account while passing the required correct information*/ 
router.post('/signup/users',(req,res,next)=>{
    /** While signing up, user details is validated to make sure the user in put correct details while creating account*/
    const {error,value} = validateSignup(req.body)
    if(error){
        return res.status(406).json({
            errorMessage:error.details.map(curr=>{
                return{
                    emailMessageError:curr.message
                }
                
            })
        })
    }
    User.find({email:req.body.email})
     .then(user=>{
        if(user.length >= 1){
            return res.status(409).json({
                message:"User already exist"
            })
        }else{
            const user = new User({
                email:req.body.email,
                name:req.body.name,
                phonenumber: req.body.phonenumber,
                password:req.body.password
            })
            user.save()
             .then(result=>{
                res.status(200).json({
                    userInfo:result,
                    message:"User signed up"
                })
             })
             .catch(err=>{
                res.status(404).json({
                    error:'not reached'
                })
             })
        }
      }) 
})

/** User is logged in here after creating an account. The email is croschecked to make sure its stored in the USER data base before proceeding with the next line of code*/ 
router.post('/login/users',(req,res,next)=>{
    User.find({email:req.body.email})
     .then(user=>{
        if(user.length >= 1){
            Post.find()
             .select('userId postDetails')
             .then(posts=>{
                /** We asigned a token to every logged in user using the email and userID*/ 
                const token = jwt.sign({
                    email:user.email,
                    userId:user._id
                },'secrete',
                {
                    expiresIn:"1h"
                })
                res.status(200).json({
                    /** When a user is logged in, it will  display the user information or profile */ 
                    message:"Logged in successfully",
                    token:token,
                    details:user.map(curr=>{
                        return{
                            allPosts:posts.map(post=>{
                                return{
                                    postId:post._id,
                                    user:post.userId,
                                    postContent:post.postDetails,
                                    // request:{
                                    //     type:"GET",
                                    //     for:"Individual post",
                                    //     url:`http://localhost:3500/postit/posts/${curr._id}?postId=${post._id}`

                                    // },
                                    
                                }
                            }),                            
                            userId:curr._id,
                            request:{
                                type:"GET",
                                url:'http://localhost:3500/postit/users/'+curr._id
                            }

                        }
                    })
                })
             })
             .catch(err=>{
                res.status()
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
})

/** Getting a particular USER using the ID passed in the URL. When we successfully get that individual user , it will display the number of post the USER has made and some details about the USER too */ 
router.get('/users/:userId', auth, (req,res,next)=>{
    const userId = req.params.userId
    User.find({_id:userId})
     .select('_id email name phonenumber')
     .then(user=>{
        if(user.length >= 1){
            Post.find({userId:userId})
             .then(resp=>{
                res.status(200).json({
                    userDetails:user.map(curr=>{
                        return{
                            numberOfPost:resp.length,
                            userId:curr._id,
                            name:curr.name,
                            number:curr.phonenumber,
                            email:curr.email
                        }
                    })
                })
             })
             .catch(err=>{
                res.status(500).json({
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
})

router.patch('/users/:userId',auth, (req,res,next)=>{
    const userId = req.params.userId;
    User.find({_id:userId})
     .then(user=>{
        if(user.length < 1){
            return res.status(404).json({
                message:"User not found"
            })
        }
        User.updateOne({_id:userId},{email:req.body.email},{name:req.body.name},{phonenumber:req.body.phonenumber},{password:req.body.password})
        .then(successful=>{
            if(successful.length < 1){
                res.status(404).json({
                    message:"Cant edit user"
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

})

/** Deleting a particular USER using the ID passed in the URL. When we successfully DELETE the USER with such ID , it will display a success message notifying us that such USER is no more */
router.delete('/users/:userId',auth, (req,res,next)=>{
    const userId = req.params.userId;
    User.deleteOne({_id:userId})
     .then(result=>{
        res.status(410).json({
            message:"User deleted"
        })
     })
     .catch(err=>{
        res.status(501).json({
            error:err
        })
     })
})


module.exports = router