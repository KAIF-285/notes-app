const mongoose=require("mongoose")

const noteSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,
        default:""
    }
},{timestamps:true,versionKey:false})

module.exports=mongoose.model("Note",noteSchema)


