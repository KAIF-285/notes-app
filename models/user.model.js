const mongoose=require("mongoose")


//Schema

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        minLength:10,
        unique:true
    },
    dob:{
        type:Date
    },
    userType:{
        type:String,
        default:"CUSTOMER",
        enum:["CUSTOMER","ADMIN"]//only these 2 types are possible
    },
    provider:{
        type:String,
        enum:["password","otp","google"],
        default:"password"
    },
    googleId:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otpCode:{
        type:String
    },
    otpExpiresAt:{
        type:Date
    }
},{timestamps:true,versionKey:false})

module.exports=mongoose.model("User",userSchema)//created collection will be users(plural)