const express = require('express')

const router = express.Router()

const Post = require('../Models/post')

const {validateSignup} = require('../validation/validate')

const bcrypt = require("bcrypt")

const User = require("../Models/user")

const mongoose = require('mongoose')


router.post('/signup/users',(req,res,next)=>{
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
             .then(result =>{
                res.status(201).json({
                    message:"User created",
                    userDetails:result.map(curr=>{
                        return{
                            request:{
                                type:'POST',
                                url:'http://localhost:3500/postit/login/users'
                            }
                        }
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
})


router.post('/login/users',(req,res,next)=>{
    User.find({email:req.body.email})
     .then(user=>{
        res.status(200).json({
            message:"Logged in successfully",
            request:user.map(curr=>{
                return{
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
        res.status(500).json({
            error:err
        })
     })
})

router.get('/users/:userId',(req,res,next)=>{
    const userId = req.params.userId
    User.find({_id:userId})
     .select('_id email name phonenumber')
     .then(user=>{
        if(user){
            Post.find({userId:userId})
             .then(resp=>{
                res.status(200).json({
                    // numberOfPost:resp.length
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
        }
        
     })
     .catch(err=>{
        res.status(500).json({
            error:err
        })
     })
})

router.delete('/user/:userId', (req,res,next)=>{
    const userId = req.params.userId;
    User.delete({_id:userId})
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