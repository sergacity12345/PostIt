const express = require('express')

const bodyParser = require('body-parser')

const mongooseDb = require('mongoose')

const morgan = require('morgan')

const app = express()


app.use(morgan("dev"))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

/** Here we import all our Routes files.js*/ 
const userRouter = require('./Routes/user')
const postRouter = require('./Routes/posts')
const commentRouter = require("./Routes/comment")

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", '*')
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE")
        return res.status(200).json({})
    }
    next()
})

app.use("/postit", userRouter)
app.use('/postit',postRouter)
app.use('/postit',commentRouter)

/**  connecting to my MongoDB Compas for data management */ 
mongooseDb.set('strictQuery','false')
mongooseDb.connect("mongodb://localhost:27017/PostIt"
)

module.exports = app