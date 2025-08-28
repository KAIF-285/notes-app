//create a mw will check if request body is proper and correct
const user_model=require("../models/user.model")
const jwt=require("jsonwebtoken")
const auth_config=require("../configs/auth.config")
const verifySignUpBody=async (req,res,next)=>{
    try{
      //check for name
       if(!req.body.name)
          return res.status(400).send({
           message:"failed!name was not provided in request body"
        })
      //check for email
      if(!req.body.email)
      return res.status(400).send({
       message:"failed!email was not provided in request body"
    })

     //check for userId
     if(!req.body.userId)
     return res.status(400).send({
      message:"failed!userid was not provided in request body"
   })

   //chech user with same userid is present
   const user=await user_model.findOne({userId:req.body.userId})
      
   if(user){
    return res.status(400).send({
        message:"failed!user with same userid is already present"
     })
   }

   next()
    }catch(err){
      console.log("Error while validating the request object",err)
      res.status(500).send({
         message:"Error while validating the request body"
      })
    }
}

const verifySignInBody=async(req,res,next)=>{
    if(!req.body.userId){
        return res.status(400).send({
            message:"userid is not provided"
        })
    }

    if(!req.body.password){
        return res.status(400).send({
            message:"password is not provided"
        })
    }
    next()
}

const verifyToken=(req,res,next)=>{
    const token=req.headers['x-access-token']
    if(!token){
        return res.status(403).send({
            message:"no token found:unauthorized"
        })
    }
    jwt.verify(token,auth_config.secret,async (err,decoded)=>{
        if(err){
            return res.status(401).send({ 
              message:"Unauthorised"
            })
        }
        try{
            const user=await user_model.findOne({userId:decoded.id})
            if(!user){
               return res.status(400).send({
                message:"Unauthorized,this user for this token doesn't exist"
               })
            }
            req.user={ userId:user.userId, id:user._id, email:user.email }
            return next()
        }catch(e){
            return res.status(500).send({message:"Error validating token"})
        }
    })
}
module.exports={
    verifySignUpBody:verifySignUpBody,
    verifySignInBody:verifySignInBody,
    verifyToken:verifyToken
}