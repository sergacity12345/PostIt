/** Here we check to know if the user is authenticated to perform ceratin features like deleting since we store a token for every loged in user*/
const jwt = require("jsonwebtoken")
module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decode = jwt.verify(token,'secrete')
        req.userData = decode
        next()
    }catch(error){
        return res.status(401).json({
            message:"Auth failed"
        })
    }
}

 