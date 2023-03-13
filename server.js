const app = require('./app')

const http = require('http')

const port = process.env.PORT || 3500

const server = http.createServer(app)

server.listen(port)