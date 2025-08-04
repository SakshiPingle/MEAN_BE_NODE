const { json } = require("body-parser");
const jwt = require("jsonwebtoken")


module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token,token)
        jwt.verify(token , 'secret_this_should_be_longer')
        next();
    }catch(err){
        res.status(401).json({
           message : "Error in check auth"
        })
    }


}