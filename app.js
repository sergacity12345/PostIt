const express = require('express')

const mongooseDb = require('mongoose')

const app = express()

// connecting to my database system 
mongooseDb.set('strictQuery','false')
mongooseDb.connect("mongodb://localhost:27017/NodeApi"
)

module.exports = app