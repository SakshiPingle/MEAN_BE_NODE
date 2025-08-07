const { json } = require("body-parser");
const jwt = require("jsonwebtoken")


module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token,token)
       const decodedToken =  jwt.verify(token , 'secret_this_should_be_longer');
    //    we want to share this data while login hence we are adding it in the request
       req.userData =  {
        email : decodedToken.email,
        userId : decodedToken.userId
       }
        next();
    }catch(err){
        res.status(401).json({
           message : "Error in check auth"
        })
    }


}